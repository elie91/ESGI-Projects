<?php

namespace App\Form;

use App\Entity\{Category, FeatureValue, Product, User};
use App\Form\Type\QuillsType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\{ChoiceType, IntegerType, NumberType, TextareaType, TextType};
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {

        $builder
            ->add('name', TextType::class, [
                'required' => true,
                'label' => 'product.column.name',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'product.column.name',
                    'id' => 'validationName'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('reference', TextType::class, [
                'required' => true,
                'label' => 'product.column.reference',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'product.column.reference',
                    'id' => 'validationReference'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('categories', EntityType::class, [
                'multiple' => true,
                'required' => false,
                'label' => "category.name",
                'class' => Category::class,
                'choice_label' => function ($category) {
                    return $category->getTitle();
                },
                'attr' => [
                    'class' => 'form-control'
                ]
            ])
            ->add('description', QuillsType::class, [
                'required' => false,
                'label' => 'product.column.description',
                'attr' => [
                    'id' => 'validationDescription'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('rewrittenUrl', TextType::class, [
                'required' => false,
                'label' => "product.column.rewrittenUrl",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.rewrittenUrl",
                    'id' => 'validationRewrittenUrl'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('metaTitle', TextType::class, [
                'required' => false,
                'label' => "product.column.metaTitle",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.metaTitle",
                    'id' => 'validationMetaTitle'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('metaDescription', TextareaType::class, [
                'required' => false,
                'label' => "product.column.metaDescription",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.metaDescription",
                    'id' => 'validationMetaDescription'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('quantity', IntegerType::class, [
                'required' => false,
                'label' => "product.column.quantity",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.quantity",
                ],
                'data' => 0,
                'translation_domain' => 'messages'
            ])
            ->add('aloy', TextType::class, [
                'required' => false,
                'label' => "product.column.aloy",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.aloy",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('state', TextType::class, [
                'required' => false,
                'label' => "product.column.state",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.state",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('width', NumberType::class, [
                'required' => false,
                'label' => "product.column.width",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.width",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('height', NumberType::class, [
                'required' => false,
                'label' => "product.column.height",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.height",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('weight', NumberType::class, [
                'required' => false,
                'label' => "product.column.weight",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.weight",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('depth', NumberType::class, [
                'required' => false,
                'label' => "product.column.depth",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.depth",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('standardIndex', TextType::class, [
                'required' => false,
                'label' => "product.column.standardIndex",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.standardIndex",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('elaborator', TextType::class, [
                'required' => false,
                'label' => "product.column.elaborator",
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => "product.column.elaborator",
                ],
                'translation_domain' => 'messages'
            ])
            ->add('featureValues', EntityType::class, [
                'multiple' => true,
                'label' => "product.column.featureValues",
                'class' => FeatureValue::class,
                'choice_label' => function ($values) {
                    return $values->getValue();
                },
                'group_by' => function ($choice) {
                    return $choice->getFeature()->getName();
                },
                'attr' => [
                    'class' => 'form-control'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('userId', EntityType::class, [
                'label' => "product.column.user",
                'class' => User::class,
                'choice_label' => 'company',
                'attr' => [
                    'class' => 'form-control'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('active', ChoiceType::class, [
                'label' => "product.column.active",
                'choices' => [
                    'Active' => true,
                    'Deactivate' => false
                ],
                'attr' => [
                    'class' => 'form-control mb-3',
                ],
                'translation_domain' => 'messages',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
