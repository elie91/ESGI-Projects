<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;

trait SoftDeleteableTrait
{
  /**
   * @var \DateTime|null
   * @ORM\Column(type="datetimetz", nullable=true)
   */
  protected ?\DateTime $deletedAt;

  /**
   * @return \DateTime|null
   */
  public function getDeletedAt(): ?\DateTime
  {
    return $this->deletedAt;
  }

  /**
   * @param \DateTime|null $deletedAt
   * @return SoftDeleteableTrait
   */
  public function setDeletedAt(?\DateTime $deletedAt)
  {
    $this->deletedAt = $deletedAt;
    return $this;
  }
}
