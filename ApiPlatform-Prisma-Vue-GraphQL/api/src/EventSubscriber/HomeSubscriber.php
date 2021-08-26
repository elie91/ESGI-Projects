<?php


namespace App\EventSubscriber;

use App\Entity\Home;
use App\Entity\Rent;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Workflow\Registry;

class HomeSubscriber implements EventSubscriber
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
    $this->setHomeOwner($args);
  }

  public function setHomeOwner(LifecycleEventArgs $args)
  {
    $entity = $args->getObject();
    if ((!$entity instanceof Home && !$entity instanceof Rent) || !$this->tokenStorage->getToken()) {
      return;
    }

    $entity->setOwner($this->tokenStorage->getToken()->getUser());
    if ($entity instanceof Home) {
      $entity->setStatus(Home::CREATED);
    }
  }
}
