<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\OptionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *   attributes={
 *      "order"={"id": "DESC"}
 *   },
 * )
 * @ORM\Entity(repositoryClass=OptionRepository::class)
 */
class Option
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
   * @Groups({"event_read", "home_read", "home_write"})
   */
  private ?string $name;

  /**
   * @ORM\ManyToMany(targetEntity=Home::class, inversedBy="options")
   */
  private $homes;

  public function __construct()
  {
    $this->homes = new ArrayCollection();
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
    }

    return $this;
  }

  public function removeHome(Home $home): self
  {
    $this->homes->removeElement($home);

    return $this;
  }
}
