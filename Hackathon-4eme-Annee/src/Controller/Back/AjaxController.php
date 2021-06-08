<?php

namespace App\Controller\Back;

use App\Entity\Comment;
use App\Entity\Topic;
use App\Entity\User;
use App\Form\SearchType;
use App\Repository\TopicRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/ajax", name="ajax_")
 */
class AjaxController extends AbstractController
{
    /**
     * @Route("/comment/add", name="comment_add", methods={"POST"})
     * @return Response
     */
    public function addComment(): Response
    {
        $params = json_decode(file_get_contents('php://input'), true);

        $manager = $this->getDoctrine()->getManager();

        $user = $manager->getRepository(User::class)
            ->findOneBy(['id' => $params['author']]);

        $topic = $this->getDoctrine()
            ->getManager()
            ->getRepository(Topic::class)
            ->findOneBy(['id' => $params['topic']]);

        $comment = (new Comment())
            ->setContent($params['content'])
            ->setIsUpdated(0)
            ->setAuthor($user)
            ->setTopic($topic);

        $manager->persist($comment);
        $manager->flush();
        $data = [
            "id" => $comment->getAuthor()->getId(),
            "content" => $comment->getContent(),
            "author" => "{$comment->getAuthor()->getFullName()}",
            "date" => date('d/m/Y h:i', $comment->getCreatedAt()->getTimestamp())
        ];
        return new JsonResponse($data, 200);
    }


}
