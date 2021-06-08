<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class MaxFruit extends Constraint
{
    public $message = 'The cart "{{ string }}" contains 5 fruits of the same type';
}
