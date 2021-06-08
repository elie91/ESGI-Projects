<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\{PasswordType, RepeatedType};
use Symfony\Component\OptionsResolver\OptionsResolver;

class ResetPasswordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'user.error.samePassword',
                'first_options' => [
                    'label' => 'user.column.password',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.column.password'
                    ]],
                'second_options' => [
                    'label' => 'user.column.repeatPassword',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.column.repeatPassword'
                    ]],
                'translation_domain' => 'messages'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
