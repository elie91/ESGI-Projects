<?php

namespace App\Controller\Event;

use App\Entity\Event;
use App\Entity\Notification;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Workflow\Exception\LogicException;
use Symfony\Component\Workflow\Registry;
use Symfony\Contracts\Translation\TranslatorInterface;

class StatusController
{
  private ManagerRegistry $manager;
  private Registry $registry;
  private RequestStack $requestStack;
  /**
   * @var SerializerInterface
   */
  private SerializerInterface $serializer;
  /**
   * @var TranslatorInterface
   */
  private TranslatorInterface $translator;

  public function __construct(ManagerRegistry $manager, Registry $registry, RequestStack $requestStack, SerializerInterface $serializer, TranslatorInterface $translator)
  {
    $this->manager = $manager;
    $this->registry = $registry;
    $this->requestStack = $requestStack;
    $this->serializer = $serializer;
    $this->translator = $translator;
  }

  /**
   * @param Event $data
   * @param PublisherInterface $publisher
   * @return JsonResponse
   */
  public function __invoke(Event $data, PublisherInterface $publisher): JsonResponse
  {
    $body = json_decode($this->requestStack->getCurrentRequest()->getContent());
    $workflow = $this->registry->get($data);
    try {
      $workflow->apply($data, $body->status);
      $notification = (new Notification())
        ->setMessage("Votre événement {$data->getName()} a été {$this->translator->trans($body->status)}")
        ->setOwner($data->getRent()->getOwner());

      $this->manager->getManager()->persist($notification);

      $update = new Update(
        "http://localhost:8080/users/{$notification->getOwner()->getId()}/notifications/{$notification->getId()}",
        $this->serializer->serialize($notification, 'json')
      );

      $publisher($update);
      $this->manager->getManager()->flush();
    } catch (LogicException $exception) {
      throw new BadRequestException($exception->getMessage());
    }
    return new JsonResponse(null, 200);
  }
}
