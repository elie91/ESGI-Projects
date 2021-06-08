<?php

namespace App\Controller\Back;

use App\Entity\Project;
use App\Entity\User;
use App\Entity\UserProject;
use App\Form\ProjectType;
use App\Repository\ProjectRepository;
use App\Repository\UserProjectRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\Mapping\MappingException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/project", name="project_")
 * @IsGranted("ROLE_USER")
 */
class ProjectController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param ProjectRepository $projectRepository
     * @param UserProjectRepository $userProjectRepository
     * @return Response
     */
    public function index(ProjectRepository $projectRepository, UserProjectRepository $userProjectRepository): Response
    {
        if (in_array('ROLE_ADMIN', $this->getUser()->getRoles())){
            $projects = $projectRepository->getUsersByProject($this->getUser()->getId());
            $userProjects = $userProjectRepository->findAll();
        }else{
            $projects = $projectRepository->findBy(['ended' => false]);
            $userProjects = $userProjectRepository->findBy(['userId' => $this->getUser()->getId()]);
        }

        return $this->render('back/project/index.html.twig', [
            'projects' => $projects,
            'userProjects' => $userProjects,
        ]);
    }

    /**
     * @Route("/my-projects", name="my_projects", methods={"GET"})
     * @param UserProjectRepository $userProjectRepository
     * @return Response
     */
    public function userProjects(UserProjectRepository $userProjectRepository){
        $projects = $userProjectRepository->findBy(['userId' => $this->getUser()]);
        return $this->render('back/project/user.html.twig', [
            'projects' => $projects,
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @return Response
     */
    public function new(Request $request): Response
    {
        $project = new Project();
        $form = $this->createForm(ProjectType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($project);
            $entityManager->flush();

            $this->addFlash('success', 'Vous avez créé un nouveau projet');

            return $this->redirectToRoute('back_project_index');
        }

        return $this->render('back/project/new.html.twig', [
            'project' => $project,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="show", methods={"GET"})
     * @param Project $project
     * @return Response
     */
    public function show(Project $project, UserProjectRepository $userProjectRepository): Response
    {

        return $this->render('back/project/show.html.twig', [
            'project' => $project,
            'selected' => $userProjectRepository->findOneBy(['project' => $project->getId(), 'selected' => true])
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param Project $project
     * @return Response
     */
    public function edit(Request $request, Project $project): Response
    {
        $form = $this->createForm(ProjectType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            if ($form->getData()->getState() === 3){
                $project->setEnded(true);
            }

            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', 'Vous avez mis à jour le projet '.$project->getName());

            return $this->redirectToRoute('back_project_index');
        }

        return $this->render('back/project/edit.html.twig', [
            'project' => $project,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}/apply", name="apply")
     * @param Project $project
     * @param UserProjectRepository $userProjectRepository
     * @return Response
     */
    public function apply(Project $project, UserProjectRepository $userProjectRepository):Response
    {
        $em = $this->getDoctrine()->getManager();

        $userProject = $userProjectRepository->findOneBy(['userId' => $this->getUser(), 'project' => $project]);

        if ($userProject){
            $em->remove($userProject);
        }else{
            $userProject = (new UserProject())
                ->setUserId($this->getUser())
                ->setProject($project)
            ;
            $em->persist($userProject);
        }
        $em->flush();
        return new JsonResponse(JsonResponse::HTTP_CREATED);
    }

    /**
     * @Route("/{id}/assign/{user}/", name="assign")
     * @param Project $project
     * @param User $user
     * @param UserProjectRepository $userProjectRepository
     * @return Response
     */
    public function assignUser(Project $project,User $user ,UserProjectRepository $userProjectRepository):Response
    {
        $em = $this->getDoctrine()->getManager();

        $userProject = $userProjectRepository->findOneBy(['userId' => $user, 'project' => $project]);

        $project->setState((int)$project->getState() + 1);

        if ($userProject){
            $userProject->setSelected(true);
        }
        $em->flush();

        return $this->redirectToRoute('back_project_show', ['id' => $project->getId()]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param Project $project
     * @return Response
     */
    public function delete(Request $request, Project $project): Response
    {
        if ($this->isCsrfTokenValid('delete'.$project->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($project);
            $entityManager->flush();
            $this->addFlash('success', 'Vous avez supprimé le projet '.$project->getName());
        }

        return $this->redirectToRoute('back_project_index');
    }
}
