<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Annotation\UserAware;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Controller\Event\StatusController;

/**
 * @ApiResource(
 *   attributes={
 *      "order"={"createdAt": "DESC"},
 *      "normalization_context"={"groups"={"event_read"}},
 *      "denormalization_context"={"groups"={"event_write"}},
 *   },
 *   itemOperations={
 *      "get",
 *      "put"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getRent().getOwner() == user or object.getRent().getHome().getOwner() == user",
 *      },
 *      "delete"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getRent().getOwner() == user",
 *      },
 *      "status"={
 *        "security"="is_granted('ROLE_RENTER') or object.getRent().getHome().getOwner() == user",
 *        "path"="/events/{id}/status",
 *        "method"="POST",
 *        "controller"=StatusController::class,
 *      }
 *
 *   },
 *   collectionOperations={
 *      "post",
 *      "get" = {
 *         "security"="true"
 *       },
 *   }
 * )
 * @ORM\Entity(repositoryClass=EventRepository::class)
 * @ApiFilter(DateFilter::class, properties={"startDate", "endDate"})
 * @ApiFilter(SearchFilter::class, properties={"rent.owner": "exact", "status": "exact"})
 * @UserAware(userFieldNames={"rent.owner", "rent.home.owner"})
 */
class Event
{

  use TimestampableTrait;

  const CREATED = 'CREATED';
  const APPROVED = 'APPROVED';
  const REJECTED = 'REJECTED';

  const STATUS = [self::CREATED, self::APPROVED, self::REJECTED];

  /**
   * @ORM\Id
   * @ORM\Column(type="string", unique=true)
   * @ORM\GeneratedValue(strategy="CUSTOM")
   * @ORM\CustomIdGenerator(class="App\Doctrine\IdGenerator")
   * @Groups({"event_read", "event_user_read"})
   */
  private ?string $id;

  /**
   * @ORM\Column(type="string", length=100)
   * @Groups({"event_read", "event_write", "event_user_read"})
   * @Assert\NotBlank
   */
  private ?string $name;

  /**
   * @ORM\Column(type="integer")
   * @Groups({"event_read", "event_write", "event_user_read"})
   * @Assert\Positive
   */
  private ?int $peopleLimit;

  /**
   * @ORM\Column(type="text", nullable=true)
   * @Groups({"event_read", "event_write", "event_user_read"})
   */
  private ?string $description;

  /**
   * @ORM\OneToOne(targetEntity=Rent::class, cascade={"persist", "remove"}, orphanRemoval=true)
   * @Groups({"event_read", "event_write", "event_user_read"})
   */
  private $rent;

  /**
   * @ORM\OneToMany(targetEntity=EventUser::class, mappedBy="event", orphanRemoval=true)
   * @Groups("event_read")
   */
  private $eventUsers;

  /**
   * @ORM\Column(type="date")
   * @Groups({"event_read", "event_write", "event_user_read"})
   * @Assert\GreaterThan("today")
   */
  private $startDate;

  /**
   * @ORM\Column(type="date")
   * @Groups({"event_read", "event_write", "event_user_read"})
   * @Assert\GreaterThan(propertyPath="startDate")
   */
  private $endDate;

  /**
   * @ORM\Column(type="string", length=255)
   * @Groups({"event_read", "event_user_read"})
   * @Assert\Choice(choices=Event::STATUS, message="event.errors.status")
   */
  private $status;

  public function __construct()
  {
    $this->eventUsers = new ArrayCollection();
  }

  public function getId(): ?string
  {
    return $this->id;
  }

  public function getName(): ?string
  {
    return $this->name;
  }

  public function setName(string $name): self
  {
    $this->name = $name;

    return $this;
  }

  public function getPeopleLimit(): ?int
  {
    return $this->peopleLimit;
  }

  public function setPeopleLimit(int $peopleLimit): self
  {
    $this->peopleLimit = $peopleLimit;

    return $this;
  }

  public function getDescription(): ?string
  {
    return $this->description;
  }

  public function setDescription(?string $description): self
  {
    $this->description = $description;

    return $this;
  }

  public function getRent(): ?Rent
  {
    return $this->rent;
  }

  public function setRent(?Rent $rent): self
  {
    $this->rent = $rent;

    return $this;
  }

  /**
   * @return Collection|EventUser[]
   */
  public function getEventUsers(): Collection
  {
    return $this->eventUsers;
  }

  public function addEventUser(EventUser $eventUser): self
  {
    if (!$this->eventUsers->contains($eventUser)) {
      $this->eventUsers[] = $eventUser;
      $eventUser->setEvent($this);
    }

    return $this;
  }

  public function removeEventUser(EventUser $eventUser): self
  {
    if ($this->eventUsers->removeElement($eventUser)) {
      // set the owning side to null (unless already changed)
      if ($eventUser->getEvent() === $this) {
        $eventUser->setEvent(null);
      }
    }

    return $this;
  }

  public function getStartDate(): ?\DateTimeInterface
  {
    return $this->startDate;
  }

  public function setStartDate(\DateTimeInterface $startDate): self
  {
    $this->startDate = $startDate;

    return $this;
  }

  public function getEndDate(): ?\DateTimeInterface
  {
    return $this->endDate;
  }

  public function setEndDate(\DateTimeInterface $endDate): self
  {
    $this->endDate = $endDate;

    return $this;
  }

  public function getStatus(): ?string
  {
    return $this->status;
  }

  public function setStatus(string $status): self
  {
    $this->status = $status;

    return $this;
  }
}
