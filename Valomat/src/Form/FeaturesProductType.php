<?php

namespace App\Form;

use App\Entity\FeatureValue;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\{AbstractType,FormBuilderInterface};

class FeaturesProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
			->add('feature_values',EntityType::class, [
				'class' => FeatureValue::class,
				'choice_label' => function($value){
					return $value->getFeature()->getName().' : '.$value->getValue();
				},
				'label' => false,
				'attr' => [
					'class' => 'form-control mb-3'
				]
			])
        ;
    }
}
