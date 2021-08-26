<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Annotation\UserAware;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\RentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *   attributes={
 *     "order"={"createdAt": "DESC"},
 *     "normalization_context"={"groups"={"rent_read"}},
 *   },
 *   itemOperations={
 *      "get"={
 *        "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      },
 *      "put"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      },
 *      "delete"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      }
 *   }
 * )
 * @ORM\Entity(repositoryClass=RentRepository::class)
 * @ApiFilter(SearchFilter::class, properties={"home":"exact"})
 * @UserAware(userFieldNames={"owner", "home.owner"})
 */
class Rent
{
  use TimestampableTrait;

  /**
   * @ORM\Id
   * @ORM\Column(type="string", unique=true)
   * @ORM\GeneratedValue(strategy="CUSTOM")
   * @ORM\CustomIdGenerator(class="App\Doctrine\IdGenerator")
   * @Groups({"event_read", "rent_read"})
   */
  private ?string $id;

  /**
   * @ORM\Column(type="datetime")
   * @Groups({"rent_read", "event_write", "event_read"})
   * @Assert\GreaterThan("today")
   */
  private ?\DateTimeInterface $startDate;

  /**
   * @ORM\Column(type="datetime")
   * @Groups({"rent_read", "event_write", "event_read"})
   * @Assert\GreaterThan(propertyPath="startDate")
   */
  private ?\DateTimeInterface $endDate;

  /**
   * @ORM\Column(type="float")
   * @Groups({"rent_read", "event_write", "event_read"})
   * @Assert\Type("float")
   */
  private ?float $totalPrice;

  /**
   * @ORM\ManyToOne(targetEntity=Home::class, inversedBy="rents")
   * @Groups({"event_read", "rent_read", "event_write"})
   */
  private $home;

  /**
   * @ORM\ManyToOne(targetEntity=User::class, inversedBy="rents")
   * @Groups({"event_read", "rent_read"})
   */
  private $owner;

  /**
   * @ORM\ManyToMany(targetEntity=Service::class, mappedBy="rents", cascade="persist", orphanRemoval=true)
   * @Groups({"event_read", "rent_read", "event_write"})
   */
  private $services;

  public function __construct()
  {
    $this->services = new ArrayCollection();
  }

  public function getId(): ?string
  {
    return $this->id;
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

  public function getTotalPrice(): ?float
  {
    return $this->totalPrice;
  }

  public function setTotalPrice(float $totalPrice): self
  {
    $this->totalPrice = $totalPrice;

    return $this;
  }

  public function getHome(): ?Home
  {
    return $this->home;
  }

  public function setHome(?Home $home): self
  {
    $this->home = $home;

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

  /**
   * @return Collection|Service[]
   */
  public function getServices(): Collection
  {
    return $this->services;
  }

  public function addService(Service $service): self
  {
    if (!$this->services->contains($service)) {
      $this->services[] = $service;
      $service->addRent($this);
    }

    return $this;
  }

  public function removeService(Service $service): self
  {
    if ($this->services->removeElement($service)) {
      $service->removeRent($this);
    }

    return $this;
  }
}
