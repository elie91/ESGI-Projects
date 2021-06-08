<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Annotation\UserAware;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\HomeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Doctrine\Filter\FullTextFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Controller\Home\StatusController;

/**
 * @ApiResource(
 *   attributes={
 *     "order"={"createdAt": "DESC"},
 *     "normalization_context"={"groups"={"home_read"}},
 *     "denormalization_context"={"groups"={"home_write"}},
 *   },
 *   collectionOperations={
 *      "get"={
 *        "security"="true"
 *      },
 *      "post"={
 *        "security"="is_granted('ROLE_RENTER')"
 *      }
 *   },
 *   itemOperations={
 *      "get",
 *      "put"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      },
 *      "delete"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getOwner() == user",
 *      },
 *      "status"={
 *        "security"="is_granted('ROLE_ADMIN')",
 *        "path"="/homes/{id}/status",
 *        "method"="POST",
 *        "controller"=StatusController::class,
 *      }
 *   }
 * )
 * @ApiResource(
 *   attributes={
 *     "order"={"createdAt": "DESC"},
 *     "normalization_context"={"groups"={"home_read"}},
 *     "denormalization_context"={"groups"={"home_write"}},
 *   }
 * )
 * @ORM\Entity(repositoryClass=HomeRepository::class)
 * @ApiFilter(FullTextFilter::class, properties={"full_text"})
 * @UserAware(userFieldName="owner")
 */
class Home
{

  use TimestampableTrait;

  const CREATED = 'CREATED';
  const VERIFIED = 'VERIFIED';
  const REJECTED = 'REJECTED';

  const STATUS = [self::CREATED, self::VERIFIED, self::REJECTED];

  /**
   * @ORM\Id
   * @ORM\Column(type="string", unique=true)
   * @ORM\GeneratedValue(strategy="CUSTOM")
   * @ORM\CustomIdGenerator(class="App\Doctrine\IdGenerator")
   * @Groups({"user_read", "event_read", "home_read"})
   */
  private ?string $id;

  /**
   * @ORM\Column(type="string", length=100)
   * @Groups({"user_read", "event_read", "home_read", "home_write", "rent_read"})
   * @Assert\NotBlank
   */
  private ?string $name;

  /**
   * @ORM\Column(type="text", nullable=true)
   * @Groups({"event_read", "home_read", "home_write"})
   */
  private ?string $description;

  /**
   * @ORM\Column(type="string", length=255)
   * @Groups({"event_read", "home_read", "home_write"})
   * @Assert\NotBlank
   */
  private ?string $address;

  /**
   * @ORM\Column(type="string", length=255)
   * @Groups({"user_read", "event_read", "home_read", "home_write"})
   * @Assert\NotBlank
   */
  private ?string $city;

  /**
   * @ORM\Column(type="string", length=255)
   * @Groups({"user_read", "home_read", "home_write"})
   * @Assert\NotBlank
   */
  private ?string $country;

  /**
   * @ORM\Column(type="float")
   * @Groups({"user_read", "event_read", "home_read", "home_write"})
   * @Assert\NotBlank
   * @Assert\Type(type="float")
   */
  private ?float $price;

  /**
   * @ORM\Column(type="boolean")
   * @Assert\Type(type="bool")
   */
  private bool $active = false;

  /**
   * @ORM\ManyToMany(targetEntity=Option::class, mappedBy="homes", orphanRemoval=true)
   * @Groups({"event_read", "home_read", "home_write"})
   */
  private $options;

  /**
   * @ORM\OneToMany(targetEntity=Picture::class, mappedBy="home", cascade="persist", orphanRemoval=true)
   * @Groups({"event_read", "home_read", "home_write"})
   */
  private $pictures;

  /**
   * @ORM\OneToMany(targetEntity=Rent::class, mappedBy="home", cascade={"remove"}, orphanRemoval=true)
   */
  private $rents;

  /**
   * @ORM\ManyToOne(targetEntity=User::class, inversedBy="homes")
   * @Groups("home_read")
   */
  private $owner;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   * @Groups({"event_read", "home_read", "home_write"})
   */
  private $type;

  /**
   * @ORM\Column(type="string", length=255)
   * @Groups({"event_read", "home_read"})
   * @Assert\Choice(choices=Home::STATUS, message="Choose a valid status.")
   */
  private $status;

  public function __construct()
  {
    $this->options = new ArrayCollection();
    $this->pictures = new ArrayCollection();
    $this->rents = new ArrayCollection();
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

  public function getDescription(): ?string
  {
    return $this->description;
  }

  public function setDescription(?string $description): self
  {
    $this->description = $description;

    return $this;
  }

  public function getAddress(): ?string
  {
    return $this->address;
  }

  public function setAddress(string $address): self
  {
    $this->address = $address;

    return $this;
  }

  public function getCity(): ?string
  {
    return $this->city;
  }

  public function setCity(string $city): self
  {
    $this->city = $city;

    return $this;
  }

  public function getCountry(): ?string
  {
    return $this->country;
  }

  public function setCountry(string $country): self
  {
    $this->country = $country;

    return $this;
  }

  /**
   * @return Collection|Option[]
   */
  public function getOptions(): Collection
  {
    return $this->options;
  }

  public function addOption(Option $option): self
  {
    if (!$this->options->contains($option)) {
      $this->options[] = $option;
      $option->addHome($this);
    }

    return $this;
  }

  public function removeOption(Option $option): self
  {
    if ($this->options->removeElement($option)) {
      $option->removeHome($this);
    }

    return $this;
  }

  /**
   * @return Collection|Picture[]
   */
  public function getPictures(): Collection
  {
    return $this->pictures;
  }

  public function addPicture(Picture $Picture): self
  {
    if (!$this->pictures->contains($Picture)) {
      $this->pictures[] = $Picture;
      $Picture->setHome($this);
    }

    return $this;
  }

  public function removePicture(Picture $Picture): self
  {
    if ($this->pictures->removeElement($Picture)) {
      // set the owning side to null (unless already changed)
      if ($Picture->getHome() === $this) {
        $Picture->setHome(null);
      }
    }

    return $this;
  }

  /**
   * @return Collection|Rent[]
   */
  public function getRents(): Collection
  {
    return $this->rents;
  }

  public function addRent(Rent $rent): self
  {
    if (!$this->rents->contains($rent)) {
      $this->rents[] = $rent;
      $rent->setHome($this);
    }

    return $this;
  }

  public function removeRent(Rent $rent): self
  {
    if ($this->rents->removeElement($rent)) {
      // set the owning side to null (unless already changed)
      if ($rent->getHome() === $this) {
        $rent->setHome(null);
      }
    }

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

  public function getPrice(): ?float
  {
    return $this->price;
  }

  public function setPrice(float $price): self
  {
    $this->price = $price;

    return $this;
  }

  public function getIsActive(): ?bool
  {
    return $this->active;
  }

  public function setIsActive(bool $active): self
  {
    $this->active = $active;

    return $this;
  }

  public function getType(): ?string
  {
      return $this->type;
  }

  public function setType(?string $type): self
  {
      $this->type = $type;

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
