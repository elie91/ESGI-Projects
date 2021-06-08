<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * This is a dummy entity. Remove it!
 * @UniqueEntity(fields={"name"}, message="fruit name need to be unique")
 * @ApiResource(
 *     attributes={
 *          "normalizationContext"={"groups"={"fruit_read", "cart_read", "cart_fruit_read"}},
 *          "denormalizationContext"={"groups"={"fruit_write"}}
 *     }
 * )
 * @ORM\Entity
 *
 */
class Fruit
{
    /**
     * @var int The entity Id
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"cart_read"})
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Le nom du fruit doit faire au minimum {{ limit }} caractères",
     *      maxMessage = "Le nom du fruit doit faire au maximum {{ limit }} caractères",
     *      allowEmptyString = false
     * )
     * @Groups({"cart_read"})
     */
    public $name;

    /**
     * @ORM\OneToMany(targetEntity=CartFruit::class, mappedBy="fruit", cascade={"remove"})
     */
    private $cartFruits;

    public function __construct()
    {
        $this->cartFruits = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return Collection|CartFruit[]
     */
    public function getCartFruits(): Collection
    {
        return $this->cartFruits;
    }

    public function addCartFruit(CartFruit $cartFruit): self
    {
        if (!$this->cartFruits->contains($cartFruit)) {
            $this->cartFruits[] = $cartFruit;
            $cartFruit->setFruit($this);
        }

        return $this;
    }

    public function removeCartFruit(CartFruit $cartFruit): self
    {
        if ($this->cartFruits->contains($cartFruit)) {
            $this->cartFruits->removeElement($cartFruit);
            // set the owning side to null (unless already changed)
            if ($cartFruit->getFruit() === $this) {
                $cartFruit->setFruit(null);
            }
        }

        return $this;
    }
}
