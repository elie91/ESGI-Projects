<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Annotation\UserAware;
use App\Repository\EventUserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *   attributes={
 *      "normalization_context"={"groups"={"event_user_read"}},
 *   }
 * )
 * @ORM\Entity(repositoryClass=EventUserRepository::class)
 * @UserAware(userFieldName="user")
 */
class EventUser
{

  /**
   * @ORM\Id
   * @ORM\Column(type="string", unique=true)
   * @ORM\GeneratedValue(strategy="CUSTOM")
   * @ORM\CustomIdGenerator(class="App\Doctrine\IdGenerator")
   * @Groups("event_user_read")
   */
  private ?string $id;

  /**
   * @ORM\ManyToOne(targetEntity=User::class, inversedBy="eventUsers")
   * @Groups({"event_read", "event_user_read"})
   */
  private $user;

  /**
   * @ORM\ManyToOne(targetEntity=Event::class, inversedBy="eventUsers")
   * @Groups({"event_user_read"})
   */
  private $event;

  /**
   * @ORM\Column(type="boolean")
   * @Assert\Type("bool")
   * @Groups({"event_user_read"})
   */
  private ?bool $isOwner = false;

  public function getId(): ?string
  {
    return $this->id;
  }

  public function getUser(): ?User
  {
    return $this->user;
  }

  public function setUser(?User $user): self
  {
    $this->user = $user;

    return $this;
  }

  public function getEvent(): ?Event
  {
    return $this->event;
  }

  public function setEvent(?Event $event): self
  {
    $this->event = $event;

    return $this;
  }

  public function getIsOwner(): ?bool
  {
    return $this->isOwner;
  }

  public function setIsOwner(bool $isOwner): self
  {
    $this->isOwner = $isOwner;

    return $this;
  }
}
