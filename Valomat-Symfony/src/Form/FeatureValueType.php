<?php

namespace App\Form;

use App\Entity\{Feature, FeatureValue};
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FeatureValueType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('feature', EntityType::class, [
                'class' => Feature::class,
                'label' => 'product.column.name',
                'choice_label' => 'name',
                'attr' => [
                    'class' => 'form-control mb-3'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('value', TextType::class, [
                'label' => "featureValue.column.value",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => ''
                ],
                'translation_domain' => 'messages'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => FeatureValue::class,
        ]);
    }
}
