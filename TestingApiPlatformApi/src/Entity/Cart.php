<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"cart_read"}},
 *     itemOperations={"get","delete"}
 * )
 * @ORM\Entity
 *
 */
class Cart
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
     * @ORM\OneToMany(targetEntity=CartFruit::class, mappedBy="cart", cascade={"persist", "remove"})
     * @ApiSubresource()
     * @Groups({"cart_read"})
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
            $cartFruit->setCart($this);
        }

        return $this;
    }

    public function removeCartFruit(CartFruit $cartFruit): self
    {
        if ($this->cartFruits->contains($cartFruit)) {
            $this->cartFruits->removeElement($cartFruit);
            // set the owning side to null (unless already changed)
            if ($cartFruit->getCart() === $this) {
                $cartFruit->setCart(null);
            }
        }

        return $this;
    }
}
