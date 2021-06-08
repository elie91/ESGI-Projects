<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\PictureRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *   itemOperations={
 *      "get",
 *      "put"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getHome().getOwner() == user",
 *      },
 *      "delete"={
 *         "security"="is_granted('ROLE_ADMIN') or object.getHome().getOwner() == user",
 *      }
 *   }
 * )
 * @ORM\Entity(repositoryClass=PictureRepository::class)
 */
class Picture
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
   * @Groups({"event_read", "home_read", "home_write"})
   * @Assert\NotBlank
   */
  private ?string $image;

  /**
   * @ORM\ManyToOne(targetEntity=Home::class, inversedBy="pictures")
   */
  private $home;

  /**
   * @ORM\Column(type="boolean")
   * @Groups({"event_read", "home_read", "home_write"})
   * @Assert\Type("bool")
   */
  private ?bool $isMainPicture = false;

  public function getId(): ?string
  {
    return $this->id;
  }

  public function getImage(): ?string
  {
    return $this->image;
  }

  public function setImage(string $image): self
  {
    $this->image = $image;

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

  public function getIsMainPicture(): ?bool
  {
    return $this->isMainPicture;
  }

  public function setIsMainPicture(?bool $isMainPicture): self
  {
    $this->isMainPicture = $isMainPicture;

    return $this;
  }
}
