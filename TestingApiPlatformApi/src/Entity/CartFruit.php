<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(normalizationContext={"cart_fruit_read"})
 * @ORM\Entity
 *
 */
class CartFruit
{
    /**
     * @var int The entity Id
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"cart_read","cart_fruit_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Cart::class, inversedBy="cartFruits", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"cart_fruit_read"})
     */
    private $cart;

    /**
     * @ORM\ManyToOne(targetEntity=Fruit::class, inversedBy="cartFruits")
     * @ORM\JoinColumn(nullable=false)
     * @ApiSubresource()
     * @Groups({"cart_read","cart_fruit_read"})
     */
    private $fruit;

    /**
     * @Assert\LessThanOrEqual(5)
     * @ORM\Column(type="integer")
     * @Groups({"cart_read", "cart_fruit_read"})
     */
    private $quantity;

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
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): self
    {
        $this->cart = $cart;

        return $this;
    }

    public function getFruit(): ?Fruit
    {
        return $this->fruit;
    }

    public function setFruit(?Fruit $fruit): self
    {
        $this->fruit = $fruit;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

}
