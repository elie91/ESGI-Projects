<?php

namespace App\Form;

use App\Entity\Constant;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ConstantType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('value', TextType::class)
        ;

        if (!$options['edit']){
            $builder
                ->add('type', ChoiceType::class, [
                    'choices' => [
                        'Type' => 'TYPE',
                        'user.job' => 'JOB',
                        'user.state' => 'STATE_USER'
                    ],
                    'placeholder' => 'constant.select',
                ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Constant::class,
            'edit' => null
        ]);
    }
}
