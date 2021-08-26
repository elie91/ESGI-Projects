<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class ContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'label' => 'user.email',
                'attr' => [
                    'class' => 'mb-3',
                    'placeholder' => 'user.email',
                    'autocomplete' => 'email',
                ],
            ])
            ->add('name', TextType::class, [
                'label' => 'user.name',
                'attr' => [
                    'class' => 'mb-3',
                    'placeholder' => 'user.name',
                    'autocomplete' => 'family-name'

                ],
            ])
            ->add('subject', TextType::class, [
                'label' => 'contact.subject',
                'attr' => [
                    'class' => 'mb-3',
                    'placeholder' => 'contact.subject',
                ],
            ])
            ->add('phone', TextType::class, [
                'label' => 'contact.phone',
                'attr' => [
                    'class' => 'mb-3',
                    'placeholder' => 'contact.phone',
                ],
            ])
            ->add('company', TextType::class,[
                'label' => 'contact.company',
                'required' => false,
                'attr' => [
                    'class' => 'mb-3',
                    'placeholder' => 'contact.company',
                ],
            ])
            ->add('message', TextareaType::class, [
                'label' => 'contact.message',
                'required' => false,
                'attr' => [
                    'class' => 'mb-3',
                    'placeholder' => 'contact.message',
                ],
            ])
        ;

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => null,
        ]);
    }
}
