<?php
namespace App\Entity\Traits;
use DateTime;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

trait TimestampableTrait {

	/**
	 * @var DateTime $created
	 *
	 * @Gedmo\Timestampable(on="create")
	 * @ORM\Column(type="datetime")
	 */
	private $createdAt;
	/**
	 * @var DateTime $updated
	 *
	 * @Gedmo\Timestampable(on="update")
	 * @ORM\Column(type="datetime")
	 */
	private $updatedAt;
	/**
	 * @return DateTime
	 */
	public function getCreatedAt(): DateTime
	{
		return $this->createdAt;
	}
	/**
	 * @param DateTime $createdAt
	 * @return TimestampableTrait
	 */
	public function setCreatedAt(DateTime $createdAt): self
	{
		$this->createdAt = $createdAt;
		return $this;
	}
	/**
	 * @return DateTime
	 */
	public function getUpdatedAt(): DateTime
	{
		return $this->updatedAt;
	}
	/**
	 * @param DateTime $updatedAt
	 * @return TimestampableTrait
	 */
	public function setUpdatedAt(DateTime $updatedAt): self
	{
		$this->updatedAt = $updatedAt;
		return $this;
	}
}





