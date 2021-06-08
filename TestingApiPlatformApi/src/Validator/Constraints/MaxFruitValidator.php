<?php

namespace App\Validator\Constraints;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class MaxFruitValidator extends ConstraintValidator
{
    /**
     * @param ArrayCollection|mixed $value
     * @param Constraint $constraint
     *
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof MaxFruit) {
            throw new UnexpectedTypeException($constraint, MaxFruit::class);
        }

        if (!$value instanceof ArrayCollection) {
            throw new UnexpectedValueException($value, 'ArrayCollection');
        }

        foreach ($value->toArray() as $fruit){

        }

        dump($value);
        /*if (!preg_match('/^[a-zA-Z0-9]+$/', $value, $matches)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', $value)
                ->addViolation();
        }*/
    }
}
