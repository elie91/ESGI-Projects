<?php

namespace App\Form;

use App\Entity\{Product, Quote};
use App\Repository\ProductRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\{EmailType, TelType, TextareaType, TextType};
use Symfony\Component\OptionsResolver\OptionsResolver;

class QuoteType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {

        $builder
            ->add('company', TextType::class, [
                'label' => 'user.column.company',
                'required' => true,
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.company',
                    'id' => 'validationCompany'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('email', EmailType::class, [
                'label' => 'user.column.email',
                'required' => true,
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.email',
                    'id' => 'validationEmail'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('phone', TelType::class, [
                'label' => 'user.column.phone',
                'required' => true,
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.phone',
                    'id' => 'validationPhone'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('firstname', TextType::class, [
                'label' => 'user.column.firstname',
                'required' => true,
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.firstname',
                    'id' => 'validationFirstname'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('lastname', TextType::class, [
                'label' => 'user.column.lastname',
                'required' => true,
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.lastname',
                    'id' => 'validationLastname'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('message', TextareaType::class, [
                'label' => 'quote.message',
                'required' => true,
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'quote.message',
                    'id' => 'validationMessage'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('product', EntityType::class, [
                'class' => Product::class,
                'label' => 'product.singular',
                'query_builder' => function (ProductRepository $er) {
                    return $er->createQueryBuilder('product')
                        ->orderBy('product.name', 'ASC');
                },
                'choice_label' => 'name',
                'attr' => [
                    'class' => 'form-control mb-3'
                ],
                'data' => $options['product'] ?? null
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Quote::class,
            'product' => null,
        ]);
    }
}
