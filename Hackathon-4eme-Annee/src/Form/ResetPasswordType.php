<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;

class ResetPasswordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'user.error.samePassword',
                'first_options' => [
                    'label' => 'user.password',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.password'
                    ]],
                'second_options' => [
                    'label' => 'user.repeatPassword',
                    'attr' => [
                        'class' => 'form-control mb-3',
                        'placeholder' => 'user.repeatPassword'
                    ]],
                'translation_domain' => 'messages',
                'constraints' => [new Length([
                    'min' => 6,
                    'max' => 255,
                    'minMessage' => "assert.password.min",
                    'maxMessage' => "assert.password.max"
                ])]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => null,
        ]);
    }
}
