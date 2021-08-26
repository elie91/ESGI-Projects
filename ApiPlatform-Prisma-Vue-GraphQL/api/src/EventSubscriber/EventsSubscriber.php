<?php


namespace App\EventSubscriber;

use App\Entity\Event;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Workflow\Registry;

class EventsSubscriber implements EventSubscriber
{
  private TokenStorageInterface $tokenStorage;
  private Registry $registry;

  public function __construct(TokenStorageInterface $tokenStorage, Registry $registry)
  {
    $this->tokenStorage = $tokenStorage;
    $this->registry = $registry;
  }

  /**
   * @inheritDoc
   */
  public function getSubscribedEvents(): array
  {
    return [
      Events::prePersist,
    ];
  }

  /**
   * @param LifecycleEventArgs $args
   */
  public function prePersist(LifecycleEventArgs $args)
  {
    $this->setEventOwner($args);
  }

  public function setEventOwner(LifecycleEventArgs $args)
  {
    $entity = $args->getObject();
    if (!$entity instanceof Event || !$this->tokenStorage->getToken()) {
      return;
    }
    $entity->setStatus(Event::CREATED);
  }
}
