<?php

namespace App\EventListener;

use App\Entity\User;
use App\Service\NotificationService;
use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Exception;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class GenerateTokenSubscriber implements EventSubscriber
{
    private $translator;

    private $notification;

    private $router;

    private $tokenGenerator;

    /**
     * GenerateTokenSubscriber constructor.
     * @param NotificationService $notification
     * @param TranslatorInterface $translator
     * @param UrlGeneratorInterface $router
     */
    public function __construct(NotificationService $notification, TranslatorInterface $translator,TokenGeneratorInterface $tokenGenerator ,UrlGeneratorInterface $router)
    {
        $this->notification = $notification;
        $this->translator = $translator;
        $this->router = $router;
        $this->tokenGenerator = $tokenGenerator;
    }

    /**
     * @inheritDoc
     */
    public function getSubscribedEvents()
    {
        return [
            Events::prePersist
        ];
    }

    /**
     * @param LifecycleEventArgs $args
     * @throws Exception
     * @throws TransportExceptionInterface
     */
    public function prePersist(LifecycleEventArgs $args)
    {
        $this->generateToken($args);
    }

    /**
     * @param LifecycleEventArgs $args
     * @throws Exception
     * @throws TransportExceptionInterface
     */
    public function generateToken(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        if (!$entity instanceof User) {
            return;
        }

        $token = $this->tokenGenerator->generateToken();
        $entity->setToken($token);
        $this->notification->sendEmail(
            isset($_ENV['EMAIL_TO']) ? $_ENV['EMAIL_TO'] :$entity->getEmail(),
            $this->translator->trans('email.confirmUser.subject'),
            'emails/confirm-user.html.twig',
            [
                'name' => $entity->getFullName(),
                'link' => $this->router->generate('security_confirm', ['token' => $token, '_locale' => 'fr'], UrlGeneratorInterface::ABSOLUTE_URL)
            ]
        );
    }
}