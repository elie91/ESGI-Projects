<?php


namespace App\Controller\Back;


use App\Entity\User;
use App\Form\{SendProductType,UserType};
use App\Repository\UserRepository;
use App\Service\FileUploader;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{JsonResponse,Request,Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * @Route("/user", name="user_")
 */
class UserController extends AbstractController
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/", name="index", methods={"GET"})
     * @param UserRepository $userRepository
     * @param Request $request
     * @return Response
     */
    public function index(UserRepository $userRepository, Request $request): Response
    {
        return $this->render('back/user/index.html.twig', [
            'current_user' => $this->getUser(),
            'users' => $userRepository->findAll()
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function new(Request $request, TranslatorInterface $translator): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user, [
            'admin' => in_array('ROLE_ADMIN', $this->getUser()->getRoles()) ? true : false
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('user.flash.new'));

            return $this->redirectToRoute('back_user_index');
        }

        return $this->render('back/user/new.html.twig', [
            'product' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}", name="show", methods={"GET"})
     * @param User $user
     * @return Response
     */
    public function show(User $user): Response
    {
        return $this->render('back/user/show.html.twig', [
            'user' => $user,
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param User $user
     * @return Response
     */
    public function edit(Request $request, TranslatorInterface $translator, User $user): Response
    {
        $form = $this->createForm(UserType::class, $user, [
            'admin' => in_array('ROLE_ADMIN', $this->getUser()->getRoles()) ? true : false
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', $translator->trans('user.flash.update'));

            return $this->redirectToRoute('back_user_index');
        }

        return $this->render('back/user/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
            'update' => true
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param User $user
     * @return Response
     */
    public function delete(Request $request, TranslatorInterface $translator, User $user): Response
    {
        if ($this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($user);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('user.flash.delete'));
        }

        return $this->redirectToRoute('back_user_index');
    }

    /**
     * @IsGranted("ROLE_USER")
     * @Route("/send/product", name="send_product", methods={"POST", "GET"})
     * @param Request $request
     * @param FileUploader $fileUploader
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function sendProduct(Request $request, FileUploader $fileUploader, TranslatorInterface $translator): Response
    {
        $form = $this->createForm(SendProductType::class, null);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $file = $form['file']->getData();

            if($file->getClientMimeType() !== 'text/csv'){
                $this->addFlash('danger', $translator->trans('product.flash.import.mime'));
                return $this->redirectToRoute('back_user_send_product');
            }

            if ($file) {
                if ($fileUploader->send($file, $this->getUser())) {
                    $this->getUser()->setState(2);
                    $this->getDoctrine()->getManager()->flush();
                    $this->addFlash('success', $translator->trans('user.flash.file.import'));
                } else {
                    $this->addFlash('danger', $translator->trans('user.flash.file.error'));
                }
            }
        }

        return $this->render('back/user/send_file.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/refresh/tracking", name="refresh", methods={"GET"})
     * @return JsonResponse
     */
    public function ajaxTracking(): JsonResponse
    {
        return new JsonResponse($this->getUser() ? $this->getUser()->getState() : []);
    }

    /**
     * @IsGranted("ROLE_USER")
     * @Route("tracking", name="tracking", methods={"GET"})
     * @return Response
     */
    public function tracking(): Response
    {
        return $this->render('back/user/tracking.html.twig', [
            'user' => $this->getUser(),
        ]);
    }
}

