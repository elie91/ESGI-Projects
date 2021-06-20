<?php

namespace App\Repository;

use App\Entity\Test;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Test|null find($id, $lockMode = null, $lockVersion = null)
 * @method Test|null findOneBy(array $criteria, array $orderBy = null)
 * @method Test[]    findAll()
 * @method Test[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Test::class);
    }

    public function searchBy(array $data = null)
    {
        $query = $this->createQueryBuilder('test')
            ->select('test')
            ->where('test.type = :type')
            ->setParameter('type', 'SKILL');

        if ($data !== null) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(test.title) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }

        $query->orderBy('test.id', 'asc');
        return $query->getQuery()->getResult();
    }
}
