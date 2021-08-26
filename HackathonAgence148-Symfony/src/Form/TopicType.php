<?php

namespace App\Form;

use App\Entity\Topic;
use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TopicType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'topic.title',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'topic.titlePlaceholder',
                    'autocomplete' => 'title'
                ]
            ])
            ->add('content', TextareaType::class, [
                'label' => 'topic.content',
                'attr' => [
                    'class' => 'form-control mb-3',
                    'placeholder' => 'topic.contentPlaceholder',
                    'autocomplete' => 'title'
                ]
            ]);

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Topic::class
        ]);
    }
}
