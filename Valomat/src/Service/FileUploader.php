<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class FileUploader
{
	private $targetDirectory;

	private $notification;

	private $translator;

	public function __construct($targetDirectory, NotificationService $notification, TranslatorInterface $translator)
	{
		$this->targetDirectory = $targetDirectory;
		$this->notification = $notification;
		$this->translator = $translator;
	}

	public function upload(UploadedFile $file)
	{
		$originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
		$safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
		$fileName = $safeFilename.'-'.date('Y-m-d-H-i-s').'.'.$file->guessClientExtension();
		try {
			$file->move($this->getTargetDirectory(), $fileName);
		} catch (FileException $e) {
			return false;
		}

		return $fileName;
	}


	public function send(UploadedFile $file, UserInterface $user){

        try {
            $file->move($file->getPath(), $file->getClientOriginalName());
        } catch (FileException $e) {
            return false;
        }

        $this->notification->sendEmail(
            "valomat@thomascoichot.fr",
            'coichot.t@gmail.com',
            $this->translator->trans('mail.file.subject'),
            'email/send_file.html.twig' ,[
                'user' => $user
            ] ,
            $file->getPath()."/".$file->getClientOriginalName()
        );

        return true;
    }

	public function getTargetDirectory()
	{
		return $this->targetDirectory;
	}
}