<?php
namespace App\Controller\Front;

use App\Form\ContactType;
use App\Service\NotificationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    /**
     * @Route("/",name="index", methods={"GET", "POST"})
     * @param Request $request
     * @return Response
     * @throws TransportExceptionInterface
     */
    public function index(Request $request, NotificationService $notification):Response
    {

        $form = $this->createForm(ContactType::class, null);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $notification->sendEmail($_ENV['EMAIL_TO'], $form->getData()["subject"],'emails/contact.html.twig', [
                'name' => $form->getData()["name"],
                'email_user' => $form->getData()["email"],
                'company' => $form->getData()["company"],
                'phone' => $form->getData()["phone"],
                'message' => $form->getData()["message"],
            ]);
        }

        return $this->render('front/index.html.twig', [
            'errors' => [],
            'form' => $form->createView()
        ]);
    }
}