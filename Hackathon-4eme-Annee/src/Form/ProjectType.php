<?php

namespace App\Form;

use App\Entity\Project;
use App\Entity\UserProject;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProjectType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'project.name'
            ])
            ->add('description', TextareaType::class, [
                'label' => 'project.description'
            ])
            ->add('company', TextType::class, [
                'label' => 'project.company'
            ])
            ->add('ended', CheckboxType::class, [
                'required' => false,
                'label' => 'project.ended'
            ])
            ->add('state', ChoiceType::class, [
                'label' => 'project.state',
                'choices' => [
                    "tracking.select.short" => 1,
                    "tracking.relation.short" => 2,
                    "tracking.finish.short" => 3
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Project::class,
        ]);
    }
}
