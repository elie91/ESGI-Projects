<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Annotation\UserAware;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\NotificationRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(
 *   attributes={
 *      "order"={"createdAt": "DESC"}
 *   },
 *   collectionOperations={
 *      "get"={
 *        "security"="true"
 *      },
 *      "post"={
 *        "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_RENTER')"
 *      }
 *   },
 *   itemOperations={
 *      "get"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      },
 *      "put"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      },
 *      "delete"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      }
 *   }
 * )
 * @ORM\Entity(repositoryClass=NotificationRepository::class)
 * @UserAware(userFieldName="owner")
 */
class Notification
{

  use TimestampableTrait;

  /**
   * @ORM\Id
   * @ORM\Column(type="string", unique=true)
   * @ORM\GeneratedValue(strategy="CUSTOM")
   * @ORM\CustomIdGenerator(class="App\Doctrine\IdGenerator")
   */
  private ?string $id;

  /**
   * @ORM\Column(type="text")
   */
  private ?string $message;

  /**
   * @ORM\ManyToOne(targetEntity=User::class, inversedBy="notifications")
   */
  private $owner;

  /**
   * @ORM\Column(type="boolean", options={"default": false})
   */
  private bool $viewed = false;

  public function getId(): ?string
  {
    return $this->id;
  }

  public function getMessage(): ?string
  {
    return $this->message;
  }

  public function setMessage(string $message): self
  {
    $this->message = $message;

    return $this;
  }

  public function getOwner(): ?User
  {
    return $this->owner;
  }

  public function setOwner(?User $owner): self
  {
    $this->owner = $owner;

    return $this;
  }

  public function getViewed(): ?bool
  {
    return $this->viewed;
  }

  public function setViewed(bool $viewed): self
  {
    $this->viewed = $viewed;

    return $this;
  }
}
