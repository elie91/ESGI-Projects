<?php

namespace App\Annotation;

use Doctrine\Common\Annotations\Annotation;

/**
 * @Annotation
 * @Target("CLASS")
 */
final class UserAware
{
  public $userFieldName;
  public $userFieldNames;
  public array $exceptUrls = [];
}
