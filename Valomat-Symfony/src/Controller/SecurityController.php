<?php

namespace App\Controller;

use App\Form\{ResetPasswordType, UserType};
use App\Service\ResetPassword;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{RedirectResponse, Request, Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\PasswordEncoderInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
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
     * Update Current User
     * @IsGranted("ROLE_USER")
     * @Route("my-account", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @return Response
     */
    public function edit(Request $request, TranslatorInterface $translator, UserPasswordEncoderInterface $passwordEncoder): Response
    {
        $form = $this->createForm(UserType::class, $this->getUser(), [
            'admin' => in_array('ROLE_ADMIN', $this->getUser()->getRoles()) ? true : false,
            'update' => true
        ]);
        $form->handleRequest($request);

        $passwordIsEdit = false;

        if ($form->isSubmitted() && $form->isValid()) {
            if ($form->getData()->getOldPassword()){
                if (!$passwordEncoder->isPasswordValid($this->getUser(), $form->getData()->getOldPassword())){
                    $form->getData()->setPlainPassword(null);
                    $passwordIsEdit = true;
                    $this->addFlash('danger', $translator->trans('user.flash.passwordFail'));
                }
            }
            $this->getDoctrine()->getManager()->flush();
            if (!$passwordIsEdit){
                $this->addFlash('success', $translator->trans('user.flash.update'));
            }

            return $this->redirectToRoute('security_edit');
        }

        return $this->render('front/user/edit.html.twig', [
            'user' => $this->getUser(),
            'form' => $form->createView(),
            'edit' => true
        ]);
    }


    /**
     * @Route("forgot-password", name="forgot_password", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param ResetPassword $resetPassword
     * @return RedirectResponse|Response
     */
    public function forgottenPassword(Request $request, TranslatorInterface $translator, ResetPassword $resetPassword)
    {
        if ($request->isMethod('POST')) {
            $resetPassword->sendMail($request);

            $this->addFlash('success', $translator->trans('user.error.emailExist'));

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
                $this->addFlash('success', $translator->trans('mail.reset.success'));

                return $this->redirectToRoute('security_login');
            } else {
                $this->addFlash('danger', $translator->trans('mail.reset.error'));

                return $this->redirectToRoute('security_forgot_password');
            }
        }

        return $this->render('security/reset-password.html.twig', [
            'token' => $token,
            'form' => $form->createView()
        ]);
    }
}
