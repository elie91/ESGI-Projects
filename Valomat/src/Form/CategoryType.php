<?php

namespace App\Form;

use App\Entity\Category;
use App\Form\Type\QuillsType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\{AbstractType,FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\{NumberType, TextareaType, TextType};
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class,[
                'required' => true,
                'label' => "product.column.name",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.name",
                    'id' => 'validationTitle'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('description', QuillsType::class,[
                'required' => true,
                'label' => "product.column.description",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.description",
                    'id' => 'validationDescription'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('metaTitle',TextType::class,[
                'required' => false,
                'label' => 'product.column.metaTitle',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'product.column.metaTitle',
                    'id' => 'validationMetaTitle'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('metaDescription', TextareaType::class, [
                'required' => false,
                'label' => 'product.column.metaDescription',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'product.column.metaDescription',
                    'id' => 'validationMetaDescription'
                ],
                'translation_domain' => 'messages'
            ])

        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Category::class,
        ]);
    }
}
