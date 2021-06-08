<?php

namespace App\Controller\Back;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\ConstantRepository;
use App\Service\FileUploader;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @IsGranted("ROLE_GUEST")
 * @Route("/profile", name="profile_")
 */
class ProfileController extends AbstractController
{

    /**
     * @Route("/", name="index", methods={"GET"})
     * @param ConstantRepository $constantRepository
     * @return Response
     */
    public function index(ConstantRepository $constantRepository){
        $user = $this->getUser();
        $job = $constantRepository->findOneBy(['type' => 'JOB', 'position' => $user->getJob()]);
        return $this->render('back/profile/index.html.twig', [
            'user' => $user,
            'job' => $job ? strtolower($job->getValue()) : null
        ]);
    }

    /**
     * @Route("/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param TranslatorInterface $translator
     * @param FileUploader $fileUploader
     * @param ConstantRepository $constantRepository
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function edit(Request $request, UserPasswordEncoderInterface $passwordEncoder, TranslatorInterface $translator, FileUploader $fileUploader, ConstantRepository $constantRepository): Response
    {
        $user = new User();
        $user->setPassword($this->getUser()->getPassword());

        $form = $this->createForm(UserType::class, $this->getUser(), [
            'oldPassword' => true,
            'jobs' => $constantRepository->findBy(['type' => 'JOB']),
            'states' => $constantRepository->findBy(['type' => 'STATE_USER']),
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            if ($form->getData()->getPlainPassword()){
                if (!$passwordEncoder->isPasswordValid($user, $form->getData()->getOldPassword())){
                    $this->addFlash('danger', $translator->trans('user.error.password'));
                    return $this->redirectToRoute('back_profile_edit');
                }
            }

            if ($form->getData()->getPicture() instanceof UploadedFile){
                $filename = $fileUploader->upload($form->getData()->getPicture(), $this->getUser());
                $this->getUser()->setPicture($filename);
            }

            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', $translator->trans('flash.userUpdated'));

            return $this->redirectToRoute('back_profile_edit');
        }

        return $this->render('back/profile/edit.html.twig', [
            'user' => $this->getUser(),
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/delete", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function delete(Request $request, TranslatorInterface $translator): Response
    {
        /** @var User $user **/
        $user = $this->getUser();
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $user->setDeleted(true);
            $entityManager->flush();
            $this->addFlash('success', $translator->trans('flash.userDeleted'));
            return $this->redirectToRoute('security_logout');
        }else{
            $this->addFlash('danger', $translator->trans('flash.invalidToken'));
        }

        return $this->redirectToRoute('back_user_edit');
    }
}
