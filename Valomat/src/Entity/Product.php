<?php

namespace App\Entity;

use App\Entity\Traits\TimestampableTrait;
use Doctrine\Common\Collections\{ArrayCollection, Collection};
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 */
class Product
{
    use TimestampableTrait;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups("product")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(
     *      min = 2,
     *      max = 255,
     *      minMessage = "Your product name must be at least {{ limit }} characters long",
     *      maxMessage = "Your product name cannot be longer than {{ limit }} characters"
     * )
     * @Groups("product")
     */
    private $name;

    /**
     * @Assert\Length(
     *      min = 1,
     *      max = 255,
     *      minMessage = "Your product name must be at least {{ limit }} characters long",
     *      maxMessage = "Your product name cannot be longer than {{ limit }} characters"
     * )
     * @ORM\Column(type="string", length=255)
     * @Groups("product")
     */
    private $reference;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups("product")
     */
    private $description;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $metaDescription;

    /**
     * @Assert\Length(
     *        max = 255,
     *      maxMessage = "Your product meta title cannot be longer than {{ limit }} characters"
     * )
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $metaTitle;

    /**
     * @ORM\Column(type="string", length=255, nullable=true, unique=true)
     */
    private $rewrittenUrl;

    /**
     * @Gedmo\Slug(fields={"rewrittenUrl"})
     * @ORM\Column(length=128, unique=true)
     * @Groups("product")
     */
    private $slug;

    /**
     * @ORM\Column(type="integer")
     * @Groups("product")
     */
    private $quantity;

    /**
     * @Assert\Length(
     *        max = 255,
     *      maxMessage = "Your product meta title cannot be longer than {{ limit }} characters"
     * )
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("product")
     */
    private $aloy;

    /**
     * @Assert\Type(
     *     type="float",
     *     message="The width {{ value }} is not a valid {{ type }}."
     * )
     * @ORM\Column(type="float", nullable=true)
     * @Groups("product")
     */
    private $width;

    /**
     * @Assert\Type(
     *     type="float",
     *     message="The height {{ value }} is not a valid {{ type }}."
     * )
     * @ORM\Column(type="float", nullable=true)
     * @Groups("product")
     */
    private $height;

    /**
     * @Assert\Type(
     *     type="float",
     *     message="The weight {{ value }} is not a valid {{ type }}."
     * )
     * @ORM\Column(type="float", nullable=true)
     * @Groups("product")
     */
    private $weight;

    /**
     * @Assert\Type(
     *     type="float",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @ORM\Column(type="float", nullable=true)
     * @Groups("product")
     */
    private $depth;

    /**
     * @Assert\Length(
     *        max = 255,
     *      maxMessage = "Your product state cannot be longer than {{ limit }} characters"
     * )
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("product")
     */
    private $state;

    /**
     * @Assert\Length(
     *      min = 1,
     *        max = 255,
     *      minMessage = "Your product standard index must be at least {{ limit }} characters long",
     *      maxMessage = "Your product standard index cannot be longer than {{ limit }} characters"
     * )
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("product")
     */
    private $standardIndex;

    /**
     * @Assert\Length(
     *      min = 1,
     *        max = 255,
     *      minMessage = "Your product elaborator must be at least {{ limit }} characters long",
     *      maxMessage = "Your product elaborator cannot be longer than {{ limit }} characters"
     * )
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("product")
     */
    private $elaborator;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Category", inversedBy="products")
     */
    private $categories;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="products")
     */
    private $userId;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Feature", inversedBy="products")
     */
    private $features;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\FeatureValue", inversedBy="products",cascade={"persist"})
     */
    private $featureValues;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $diameter;

    /**
     * @ORM\Column(type="integer")
     */
    private $active = true;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Quote", mappedBy="product")
     */
    private $quotes;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->featureValues = new ArrayCollection();
        $this->quotes = new ArrayCollection();
    }

    public function getId(): ?int
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

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

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

    public function getMetaDescription(): ?string
    {
        return $this->metaDescription;
    }

    public function setMetaDescription(?string $metaDescription): self
    {
        $this->metaDescription = $metaDescription;

        return $this;
    }

    public function getMetaTitle(): ?string
    {
        return $this->metaTitle;
    }

    public function setMetaTitle(?string $metaTitle): self
    {
        $this->metaTitle = $metaTitle;

        return $this;
    }

    public function getRewrittenUrl(): ?string
    {
        return $this->rewrittenUrl;
    }

    public function setRewrittenUrl(?string $rewrittenUrl): self
    {
        $this->rewrittenUrl = $rewrittenUrl;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @param mixed $slug
     * @return Product
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;
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

    public function getAloy(): ?string
    {
        return $this->aloy;
    }

    public function setAloy(?string $aloy): self
    {
        $this->aloy = $aloy;

        return $this;
    }

    public function getWidth(): ?float
    {
        return $this->width;
    }

    public function setWidth(?float $width): self
    {
        $this->width = $width;

        return $this;
    }

    public function getHeight(): ?float
    {
        return $this->height;
    }

    public function setHeight(?float $height): self
    {
        $this->height = $height;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getDepth(): ?float
    {
        return $this->depth;
    }

    public function setDepth(?float $depth): self
    {
        $this->depth = $depth;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(?string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getStandardIndex(): ?string
    {
        return $this->standardIndex;
    }

    public function setStandardIndex(?string $standardIndex): self
    {
        $this->standardIndex = $standardIndex;

        return $this;
    }

    public function getElaborator(): ?string
    {
        return $this->elaborator;
    }

    public function setElaborator(?string $elaborator): self
    {
        $this->elaborator = $elaborator;

        return $this;
    }

    /**
     * @return Collection|Category[]
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories[] = $category;
        }

        return $this;
    }

    public function removeCategory(Category $category): self
    {
        if ($this->categories->contains($category)) {
            $this->categories->removeElement($category);
        }

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUserId(): ?User
    {
        return $this->userId;
    }

    /**
     * @param User|null $userId
     * @return Product
     */
    public function setUserId(?User $userId): self
    {
        $this->userId = $userId;
        return $this;
    }


    /**
     * @return Collection|FeatureValue[]
     */
    public function getFeatureValues(): Collection
    {
        return $this->featureValues;
    }

    public function addFeatureValue(FeatureValue $featureValue): self
    {
        if (!$this->featureValues->contains($featureValue)) {
            $this->featureValues[] = $featureValue;
        }

        return $this;
    }

    public function removeFeatureValue(FeatureValue $featureValue): self
    {
        if ($this->featureValues->contains($featureValue)) {
            $this->featureValues->removeElement($featureValue);
        }

        return $this;
    }

    public function getDiameter(): ?float
    {
        return $this->diameter;
    }

    public function setDiameter(?float $diameter): self
    {
        $this->diameter = $diameter;

        return $this;
    }

    public function getActive(): ?int
    {
        return $this->active;
    }

    public function setActive(int $active): self
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @return Collection|Quote[]
     */
    public function getQuotes(): Collection
    {
        return $this->quotes;
    }

    public function addQuote(Quote $quote): self
    {
        if (!$this->quotes->contains($quote)) {
            $this->quotes[] = $quote;
            $quote->setProduct($this);
        }

        return $this;
    }

    public function removeQuote(Quote $quote): self
    {
        if ($this->quotes->contains($quote)) {
            $this->quotes->removeElement($quote);
            // set the owning side to null (unless already changed)
            if ($quote->getProduct() === $this) {
                $quote->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return mixed
     */
    public function getFeatures()
    {
        return $this->features;
    }

    /**
     * @param mixed $features
     * @return Product
     */
    public function setFeatures($features)
    {
        $this->features = $features;
        return $this;
    }


}
