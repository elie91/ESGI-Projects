<?php

namespace App\Repository;

use App\Entity\Constant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Constant|null find($id, $lockMode = null, $lockVersion = null)
 * @method Constant|null findOneBy(array $criteria, array $orderBy = null)
 * @method Constant[]    findAll()
 * @method Constant[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ConstantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Constant::class);
    }

    // /**
    //  * @return Constant[] Returns an array of Constant objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Constant
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
