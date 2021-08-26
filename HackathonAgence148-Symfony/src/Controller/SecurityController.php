<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ResetPasswordType;
use App\Form\UserType;
use App\Repository\ConstantRepository;
use App\Repository\UserRepository;
use App\Service\FileUploader;
use App\Service\ResetPassword;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class SecurityController
 * @package App\Controller
 * @Route("/", name="security_")
 */
class SecurityController extends AbstractController
{

    /**
     * @Route("/register", name="register", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param ConstantRepository $constantRepository
     * @param FileUploader $fileUploader
     * @return Response
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function register(Request $request, TranslatorInterface $translator, ConstantRepository $constantRepository, FileUploader $fileUploader): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('back_index');
        }

        $user = new User();
        $form = $this->createForm(UserType::class, $user, [
            'terms' => true,
            'jobs' => $constantRepository->findBy(['type' => 'JOB']),
            'states' => $constantRepository->findBy(['type' => 'STATE_USER']),
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $user->setState(0);
            $user->setActive(1);

            $entityManager->persist($user);
            $entityManager->flush();
            $fileUploader->upload($form->get('picture')->getData(), $user);

            $this->addFlash('success', $translator->trans('flash.confirmRegister'));
            return $this->redirectToRoute('security_login');
        }

        return $this->render('security/register.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("login", name="login")
     * @param AuthenticationUtils $authenticationUtils
     * @return Response
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('back_index');
        }
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("logout", name="logout")
     * @throws Exception
     */
    public function logout()
    {
        //throw new Exception('This method can be blank - it will be intercepted by the logout key on your firewall');
    }

    /**
     * @Route("forgot-password", name="forgot_password")
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param ResetPassword $resetPassword
     * @return RedirectResponse|Response
     * @throws TransportExceptionInterface
     */
    public function forgottenPassword(Request $request, TranslatorInterface $translator, ResetPassword $resetPassword)
    {
        if ($request->isMethod('POST')) {

            $resetPassword->sendMail($request);

            $this->addFlash('success', $translator->trans('flash.resetPassword.mail'));
            return $this->redirectToRoute('security_forgot_password');
        }

        return $this->render('security/forgot-password.html.twig');
    }


    /**
     * @Route("reset-password/{token}", name="reset_password")
     * @param Request $request
     * @param string $token
     * @param ResetPassword $resetPassword
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function resetPassword(Request $request, string $token, ResetPassword $resetPassword, TranslatorInterface $translator): Response
    {
        $form = $this->createForm(ResetPasswordType::class);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if ($resetPassword->updatePassword($form->getData(), $token)) {
                $this->addFlash('success', $translator->trans('flash.resetPassword.success'));
                return $this->redirectToRoute('security_login');
            } else {
                $this->addFlash('danger', $translator->trans('flash.resetPassword.success'));
                return $this->redirectToRoute('security_forgot_password');
            }
        }

        return $this->render('security/reset-password.html.twig', [
            'token' => $token,
            'form' => $form->createView()
        ]);

    }

    /**
     * @Route("confirm/{token}", name="confirm")
     * @param Request $request
     * @param UserRepository $repository
     * @param TranslatorInterface $translator
     * @return RedirectResponse|Response
     */
    public function confirm(Request $request, UserRepository $repository, TranslatorInterface $translator)
    {
        $token = $request->attributes->get('token');
        $user = $repository->findOneBy(['token' => $token]);
        if (!$user) {
            $this->addFlash('danger', $translator->trans('flash.tokenNotExist'));
            return $this->redirectToRoute('security_login');
        }
        $user->setActive(1);
        $user->setToken(null);
        $this->getDoctrine()->getManager()->flush();

        return $this->render('security/confirm-user.html.twig');
    }
}
