<?php

namespace App\Repository;

use App\Entity\Topic;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Topic|null find($id, $lockMode = null, $lockVersion = null)
 * @method Topic|null findOneBy(array $criteria, array $orderBy = null)
 * @method Topic[]    findAll()
 * @method Topic[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TopicRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Topic::class);
    }

    public function getAll(array $data = null)
    {
        $query = $this->createQueryBuilder('topic')
            ->select('topic');

        if ($data !== null) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(topic.title) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }

        $query->orderBy('topic.createdAt', 'desc');
        return $query->getQuery()->getResult();
    }
}
