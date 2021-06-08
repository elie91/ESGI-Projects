<?php

namespace App\Form;

use App\Data\SearchProductData;
use App\Entity\{Category, FeatureValue};
use App\Repository\FeatureValueRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use \Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SearchProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'product.column.name',
                'required' => false,
                'attr' => [
                    'placeholder' => 'product.column.name',
                    'class' => 'form-control mb-3',
                ],
                'translation_domain' => 'messages'
            ])
            ->add('aloy', EntityType::class, [
                'label' => 'product.column.aloy',
                'required' => false,
                'class' => FeatureValue::class,
                'choice_label' => 'value',
                'placeholder' => "filter.front.feature",
                'query_builder' => function (FeatureValueRepository $er) {
                    return $er->createQueryBuilder('f')
                        ->where("f.feature = 2");
                },
                'attr' => [
                    'class' => 'form-control mb-3'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('categories', EntityType::class, [
                'label' => 'category.name',
                'required' => false,
                'class' => Category::class,
                'choice_label' => 'title',
                'placeholder' => "filter.front.category",
                'attr' => [
                    'class' => 'form-control mb-3'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('elaborator', TextType::class, [
                'label' => 'product.column.elaborator',
                'required' => false,
                'attr' => [
                    'placeholder' => 'product.column.elaborator',
                    'class' => 'form-control mb-3',
                ],
                'translation_domain' => 'messages'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => SearchProductData::class,
            'method' => 'GET',
            'csrf_protection' => false
        ]);
    }

    public function getBlockPrefix()
    {
        return '';
    }
}