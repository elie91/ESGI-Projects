<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ServiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *   attributes={
 *      "order"={"id": "DESC"}
 *   },
 * )
 * @ORM\Entity(repositoryClass=ServiceRepository::class)
 */
class Service
{

  /**
   * @ORM\Id
   * @ORM\Column(type="string", unique=true)
   * @ORM\GeneratedValue(strategy="CUSTOM")
   * @ORM\CustomIdGenerator(class="App\Doctrine\IdGenerator")
   */
  private ?string $id;

  /**
   * @ORM\Column(type="string", length=100)
   * @Groups("event_read")
   * @Assert\NotBlank
   */
  private ?string $name;

  /**
   * @ORM\Column(type="float")
   * @Groups("event_read")
   * @Assert\Type("float")
   */
  private ?float $price;

  /**
   * @ORM\ManyToMany(targetEntity=Rent::class, inversedBy="services")
   */
  private $rents;

  public function __construct()
  {
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

  public function getPrice(): ?float
  {
    return $this->price;
  }

  public function setPrice(float $price): self
  {
    $this->price = $price;

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
    }

    return $this;
  }

  public function removeRent(Rent $rent): self
  {
    $this->rents->removeElement($rent);

    return $this;
  }
}
