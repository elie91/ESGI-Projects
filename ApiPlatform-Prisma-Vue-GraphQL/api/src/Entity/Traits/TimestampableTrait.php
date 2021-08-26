<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;

trait TimestampableTrait
{
  /**
   * @var \DateTime $createdAt
   *
   * @Gedmo\Timestampable(on="create")
   * @ORM\Column(type="datetime")
   * @Groups({"user_read", "event_read", "home_read", "rent_read", "event_user_read"})
   */
  private \DateTime $createdAt;

  /**
   * @var \DateTime $updatedAt
   *
   * @Gedmo\Timestampable(on="update")
   * @ORM\Column(type="datetime")
   * @Groups({"user_read", "event_read", "home_read", "rent_read", "event_user_read"})
   */
  private \DateTime $updatedAt;

  /**
   * @return \DateTime
   */
  public function getCreatedAt(): \DateTime
  {
    return $this->createdAt;
  }

  /**
   * @param \DateTime $createdAt
   * @return TimestampableTrait
   */
  public function setCreatedAt(\DateTime $createdAt): self
  {
    $this->createdAt = $createdAt;
    return $this;
  }

  /**
   * @return \DateTime
   */
  public function getUpdatedAt(): \DateTime
  {
    return $this->updatedAt;
  }

  /**
   * @param \DateTime $updatedAt
   * @return TimestampableTrait
   */
  public function setUpdatedAt(\DateTime $updatedAt): self
  {
    $this->updatedAt = $updatedAt;
    return $this;
  }
}
