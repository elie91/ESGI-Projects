<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\{ChoiceType,
    EmailType,
    NumberType,
    PasswordType,
    RepeatedType,
    TextType};
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'label' => 'user.column.email',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.email'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('lastname', TextType::class, [
                'label' => 'user.column.lastname',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.lastname'
                ],
                'translation_domain' => 'messages'

            ])
            ->add('firstname', TextType::class, [
                'label' => 'user.column.firstname',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.firstname'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('plainPassword', RepeatedType::class, [
                'required' => false,
                'type' => PasswordType::class,
                'invalid_message' => 'user.error.samePassword',
                'first_options' => [
                    'label' => 'user.column.password',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.column.password',
                        'autocomplete' => 'new-password'
                    ]],
                'second_options' => [
                    'label' => 'user.column.repeatPassword',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.column.repeatPassword',
                        'autocomplete' => 'new-password'
                    ]],
                'translation_domain' => 'messages'
            ])
            ->add('phone', NumberType::class, [
                'label' => 'user.column.phone',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.phone'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('job', TextType::class, [
                'required' => false,
                'label' => 'user.column.job',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.job'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('company', TextType::class, [
                'required' => false,
                'label' => 'user.column.company',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.company'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('siret', TextType::class, [
                'required' => false,
                'label' => 'user.column.siret',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.siret'
                ],
                'translation_domain' => 'messages'
            ]);

        if ($options["admin"]) {
            $builder
                ->add('state', ChoiceType::class, [
                    'required' => false,
                    'label' => 'user.column.state',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.column.state'
                    ],
                    'placeholder' => 'user.button.selectState',
                    'data' => 1,
                    'choices' => [
                        'tracking.account.short' => 1,
                        'tracking.import.short' => 2,
                        'tracking.success.short' => 3
                    ],
                    'translation_domain' => 'messages'
                ])
                ->add('deleted', ChoiceType::class, [
                    'required' => false,
                    'label' => 'user.column.deleted',
                    'attr' => [
                        'class' => 'form-control mb-3'
                    ],
                    'placeholder' => 'user.button.selectDelete',
                    'data' => 0,
                    'choices' => [
                        'user.column.yes' => 1,
                        'user.column.no' => 0,
                    ],
                    'translation_domain' => 'messages'
                ]);
        }

        if ($options["update"]){
            $builder->add('oldPassword', PasswordType::class, [
                'label' => 'user.column.oldPassword',
                'required' => false,
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.column.oldPassword'
                ],
                'translation_domain' => 'messages'
            ]);
        }

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'admin' => false,
            'update' => false,
        ]);
    }
}
