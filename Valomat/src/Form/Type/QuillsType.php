<?php
namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class QuillsType extends AbstractType
{
	public function getBlockPrefix()
	{
		return 'quills';
	}

	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver->setDefaults([

		]);
	}

	public function getParent()
	{
		return TextareaType::class;
	}
}