<?php

namespace App\Form;

use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\FileType;

class SendProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('file', FileType::class, [
                'required' => true,
                'label' => 'product.list.file',
                'mapped' => false,
                'attr' => [
                    'class' => 'custom-file-input',
                    'id' => 'validatedCustomFile',
                ],
                'help' => 'product.list.fileHelp',
                'translation_domain' => 'messages',
                /*'constraints' => [
                    new File([
                        'maxSize' => '50M',
                        'mimeTypes' => [
                            'text/plain',
                            'text/csv',
                        ],
                        'mimeTypesMessage' => 'Please upload a valid CSV document',
                    ])
                ],*/
            ]);
    }
}
