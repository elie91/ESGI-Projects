<?php

namespace App\Form;

use App\Entity\Experience;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ExperienceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'experience.title',
                'attr' => [
                    'placeholder' => 'experience.titlePlaceholder',
                    'autocomplete' => 'title'
                ]
            ])
            ->add('description', TextareaType::class, [
                'label' => 'experience.content',
                'attr' => [
                    'placeholder' => 'experience.contentPlaceholder',
                    'autocomplete' => 'content'
                ]
            ])
            ->add('company', TextType::class, [
                'label' => 'experience.company',
                'attr' => [
                    'placeholder' => 'experience.company',
                    'autocomplete' => 'company'
                ]
            ])
            ->add('location', TextType::class, [
                'label' => 'experience.location',
                'attr' => [
                    'placeholder' => 'experience.locationPlaceholder',
                    'autocomplete' => 'location'
                ]
            ])
            ->add('startDate', DateType::class, [
                'label' => 'experience.startDate',
                'widget' => 'single_text',
            ])
            ->add('endDate', DateType::class, [
                'label' => 'experience.endDate',
                'widget' => 'single_text',
                'required' => false
            ])
            ->add('isCurrentJob', CheckboxType::class, [
                'label' => 'experience.isCurrentJob',
                'required' => false
            ]);

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Experience::class
        ]);
    }
}
