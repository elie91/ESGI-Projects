<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $jobs = [];
        $states = [];

        foreach ($options['jobs'] as $job) {
            $jobs[$job->getValue()] = $job->getPosition();
        }
        foreach ($options['states'] as $state) {
            $states[$state->getValue()] = $state->getPosition();
        }

        $builder
            ->add('email', EmailType::class, [
                'label' => 'user.email',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.email',
                    'autocomplete' => 'email'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('plainPassword', RepeatedType::class, [
                'required' =>  $options['admin'] ? false : true,
                'type' => PasswordType::class,
                'invalid_message' => 'user.error.samePassword',
                'first_options' => [
                    'label' => 'user.password',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.password',
                        'autocomplete' => 'new-password'
                    ]],
                'second_options' => [
                    'label' => 'user.repeatPassword',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.repeatPassword',
                        'autocomplete' => 'new-password'
                    ]],
                'translation_domain' => 'messages'
            ])
            ->add('picture', FileType::class, [
                'required' => false,
                'label' => 'user.picture',
                'mapped' => false,
                'constraints' => [
                    new File([
                        'maxSize' => '3M',
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/png',
                        ],
                        'mimeTypesMessage' => 'assert.picture',
                    ])
                ],
            ])
            ->add('name', TextType::class, [
                'label' => 'user.name',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.name',
                    'autocomplete' => 'family-name'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('firstname', TextType::class, [
                'label' => 'user.firstname',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'user.firstname',
                    'autocomplete' => 'given-name'
                ],
                'translation_domain' => 'messages'
            ])
            ->add('job', ChoiceType::class, [
                'label' => 'user.job',
                'placeholder' => 'user.selectJob',
                'choices' => $jobs
            ])
            ->add('city', TextType::class, [
                'label' => 'user.city',
                'required' => false
            ])
            ->add('website', TextType::class, [
                'label' => 'user.website',
                'required' => false
            ]);

        if ($options['terms']) {
            $builder->add('terms', CheckboxType::class, [
                'label' => 'user.terms',
            ]);
        }

        if ($options['admin']) {
            $builder->add('state', ChoiceType::class, [
                'label' => 'user.state',
                'placeholder' => 'user.selectState',
                'choices' => $states
            ]);
        }

        if ($options['oldPassword']) {
            $builder->add('oldPassword', PasswordType::class, [
                'required' => false,
                'label' => 'user.password',
                'attr' => [
                    'placeholder' => 'user.password',
                    'autocomplete' => 'current-password'
                ],
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'terms' => null,
            'oldPassword' => null,
            'jobs' => null,
            'states' => null,
            'admin' => null
        ]);
    }
}
