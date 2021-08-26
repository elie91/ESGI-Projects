<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\SoftDeleteableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Controller\User\ResetPasswordController;
use App\Controller\User\TokenResetPasswordController;
use App\Doctrine\Filter\FullTextFilter;

/**
 * @ApiResource(
 *     attributes={
 *          "security"="is_granted('ROLE_ADMIN') or object == user",
 *          "normalization_context"={"groups"={"user_read"}},
 *          "order"={"createdAt": "DESC"}
 *     },
 *    itemOperations={
 *      "get"={
 *        "security"="is_granted('ROLE_ADMIN') or object === user",
 *      },
 *      "put"={
 *         "security"="is_granted('ROLE_ADMIN') or object === user",
 *      },
 *      "delete"={
 *         "security"="is_granted('ROLE_ADMIN') or object === user",
 *      }
 *   },
 *     collectionOperations={
 *          "post"={
 *             "security"="true"
 *          },
 *          "get"={
 *             "security"="is_granted('ROLE_ADMIN')"
 *          },
 *          "reset-password"={
 *              "security"="true",
 *              "path"="/reset_password",
 *              "method"="POST",
 *              "controller"=ResetPasswordController::class,
 *          },
 *          "verify-token-password"={
 *              "security"="true",
 *              "path"="/token_reset_password",
 *              "method"="POST",
 *              "controller"=TokenResetPasswordController::class,
 *          }
 *     }
 * )
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="`user`")
 * @UniqueEntity("email", message="user.unique")
 * @ApiFilter(SearchFilter::class, properties={"email": "partial"})
 * @ApiFilter(FullTextFilter::class, properties={"full_text"})
 * @Gedmo\SoftDeleteable(fieldName="deletedAt", timeAware=false)
 */
class User implements UserInterface
{

  use TimestampableTrait;
  use SoftDeleteableTrait;

  /**
   * @ORM\Id
   * @ORM\Column(type="string", unique=true)
   * @ORM\GeneratedValue(strategy="CUSTOM")
   * @ORM\CustomIdGenerator(class="App\Doctrine\IdGenerator")
   * @Groups({"user_read", "home_read", "rent_read", "event_read"})
   */
  private ?string $id;

  /**
   * @ORM\Column(type="string", length=180, unique=true)
   * @Assert\Email(message="user.errors.email")
   * @Assert\NotBlank(message="user.errors.required.email")
   * @Groups({"user_read", "home_read", "rent_read", "event_read"})
   */
  private ?string $email;

  /**
   * @ORM\Column(type="json")
   * @Groups("user_read")
   */
  private array $roles = [];

  /**
   * @var string The hashed password
   * @ORM\Column(type="string")
   */
  private string $password;

  /**
   * @var string|null
   * @Assert\Length(
   *     min="8",
   *     minMessage="user.plainPassword"
   * )
   */
  private $plainPassword;


  /**
   * @var string|null
   */
  private $currentPassword;

  /**
   * @ORM\Column(type="string", length=100)
   * @Assert\NotBlank(message="user.errors.required.firstname")
   * @Groups({"user_read", "home_read", "rent_read", "event_read"})
   */
  private ?string $firstname;

  /**
   * @ORM\Column(type="string", length=100)
   * @Assert\NotBlank(message="user.errors.required.lastname")
   * @Groups({"user_read", "home_read", "rent_read", "event_read"})
   */
  private ?string $lastname;

  /**
   * @ORM\Column(type="string", length=15)
   * @Assert\NotBlank(message="user.errors.required.phone")
   * @Groups({"user_read", "home_read", "rent_read", "event_read"})
   */
  private ?string $phone;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   * @Groups({"user_read", "home_read"})
   */
  private ?string $company;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private ?string $token;

  /**
   * @ORM\OneToMany(targetEntity=Rent::class, mappedBy="owner")
   */
  private $rents;

  /**
   * @ORM\OneToMany(targetEntity=Home::class, mappedBy="owner")
   * @Groups("user_read")
   */
  private $homes;

  /**
   * @ORM\OneToMany(targetEntity=EventUser::class, mappedBy="user")
   */
  private $eventUsers;

  /**
   * @ORM\OneToMany(targetEntity=Notification::class, mappedBy="owner")
   */
  private $notifications;

  public function __construct()
  {
    $this->rents = new ArrayCollection();
    $this->homes = new ArrayCollection();
    $this->eventUsers = new ArrayCollection();
    $this->notifications = new ArrayCollection();
  }

  public function getId(): ?string
  {
    return $this->id;
  }

  public function getEmail(): ?string
  {
    return $this->email;
  }

  public function setEmail(string $email): self
  {
    $this->email = $email;

    return $this;
  }

  /**
   * A visual identifier that represents this user.
   *
   * @see UserInterface
   */
  public function getUsername(): string
  {
    return (string)$this->email;
  }

  /**
   * @see UserInterface
   */
  public function getRoles(): array
  {
    $roles = $this->roles;
    // guarantee every user at least has ROLE_USER
    $roles[] = 'ROLE_USER';

    return array_unique($roles);
  }

  public function setRoles(array $roles): self
  {
    $this->roles = $roles;

    return $this;
  }

  /**
   * @see UserInterface
   */
  public function getPassword(): string
  {
    return (string)$this->password;
  }

  public function setPassword(string $password): self
  {
    $this->password = $password;

    return $this;
  }

  /**
   * @return string|null
   */
  public function getPlainPassword(): ?string
  {
    return $this->plainPassword;
  }

  /**
   * @param string|null $plainPassword
   * @return User
   */
  public function setPlainPassword(string $plainPassword): User
  {
    $this->plainPassword = $plainPassword;
    return $this;
  }

  /**
   * @return string|null
   */
  public function getCurrentPassword(): ?string
  {
    return $this->currentPassword;
  }

  /**
   * @param string|null $currentPassword
   * @return User
   */
  public function setCurrentPassword(?string $currentPassword): User
  {
    $this->currentPassword = $currentPassword;
    return $this;
  }

  /**
   * @see UserInterface
   */
  public function getSalt()
  {
    // not needed when using the "bcrypt" algorithm in security.yaml
  }

  /**
   * @see UserInterface
   */
  public function eraseCredentials()
  {
    // If you store any temporary, sensitive data on the user, clear it here
    // $this->plainPassword = null;
  }

  public function getFirstname(): ?string
  {
    return $this->firstname;
  }

  public function setFirstname(string $firstname): self
  {
    $this->firstname = $firstname;

    return $this;
  }

  public function getLastname(): ?string
  {
    return $this->lastname;
  }

  public function setLastname(string $lastname): self
  {
    $this->lastname = $lastname;

    return $this;
  }

  /**
   * @Groups({"user_read", "event_read", "rent_read"})
   * @return string|null
   */
  public function getFullName(): ?string
  {
    return strtoupper($this->lastname) . " " . $this->firstname;
  }

  public function getPhone(): ?string
  {
    return $this->phone;
  }

  public function setPhone(string $phone): self
  {
    $this->phone = $phone;

    return $this;
  }

  public function getCompany(): ?string
  {
    return $this->company;
  }

  public function setCompany(?string $company): self
  {
    $this->company = $company;

    return $this;
  }

  public function getToken(): ?string
  {
    return $this->token;
  }

  public function setToken(?string $token): self
  {
    $this->token = $token;

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
      $rent->setOwner($this);
    }

    return $this;
  }

  public function removeRent(Rent $rent): self
  {
    if ($this->rents->removeElement($rent)) {
      // set the owning side to null (unless already changed)
      if ($rent->getOwner() === $this) {
        $rent->setOwner(null);
      }
    }

    return $this;
  }

  /**
   * @return Collection|Home[]
   */
  public function getHomes(): Collection
  {
    return $this->homes;
  }

  public function addHome(Home $home): self
  {
    if (!$this->homes->contains($home)) {
      $this->homes[] = $home;
      $home->setOwner($this);
    }

    return $this;
  }

  public function removeHome(Home $home): self
  {
    if ($this->homes->removeElement($home)) {
      // set the owning side to null (unless already changed)
      if ($home->getOwner() === $this) {
        $home->setOwner(null);
      }
    }

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
      $eventUser->setOwner($this);
    }

    return $this;
  }

  public function removeEventUser(EventUser $eventUser): self
  {
    if ($this->eventUsers->removeElement($eventUser)) {
      // set the owning side to null (unless already changed)
      if ($eventUser->getOwner() === $this) {
        $eventUser->setOwner(null);
      }
    }

    return $this;
  }

  /**
   * @return Collection|Notification[]
   */
  public function getNotifications(): Collection
  {
      return $this->notifications;
  }

  public function addNotification(Notification $notification): self
  {
      if (!$this->notifications->contains($notification)) {
          $this->notifications[] = $notification;
          $notification->setOwner($this);
      }

      return $this;
  }

  public function removeNotification(Notification $notification): self
  {
      if ($this->notifications->removeElement($notification)) {
          // set the owning side to null (unless already changed)
          if ($notification->getOwner() === $this) {
              $notification->setOwner(null);
          }
      }

      return $this;
  }
}
