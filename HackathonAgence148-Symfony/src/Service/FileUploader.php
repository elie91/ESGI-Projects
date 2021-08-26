<?php
namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class FileUploader
{
	private $targetDirectory;

	private $notification;

	private $translator;

	private $em;

	public function __construct($targetDirectory, NotificationService $notification, TranslatorInterface $translator, EntityManager $em)
	{
		$this->targetDirectory = $targetDirectory;
		$this->notification = $notification;
		$this->translator = $translator;
		$this->em = $em;
	}

    /**
     * @param UploadedFile $file
     * @param $object
     * @return bool|string
     * @throws ORMException
     * @throws OptimisticLockException
     */
	public function upload(UploadedFile $file,$object)
	{
		$fileName = $object->getId().'.'.$file->guessExtension();

		try {
			$file->move($this->getTargetDirectory(), $fileName);
		} catch (FileException $e) {
			return false;
		}

		if ($object instanceof User)
            $object->setPicture($fileName);

		$this->em->flush();

		return $fileName;
	}

	public function getTargetDirectory()
	{
		return $this->targetDirectory;
	}
}