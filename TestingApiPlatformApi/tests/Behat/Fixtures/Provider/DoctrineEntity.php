<?php

namespace App\Tests\Behat\Fixtures\Provider;

use Doctrine\Persistence\ManagerRegistry;
use Faker\Generator;
use Faker\Provider\Base as BaseProvider;

class DoctrineEntity extends BaseProvider
{
    /**
     * @var ManagerRegistry
     */
    private $doctrine;

    /**
     * DoctrineEntity constructor.
     * @param Generator $generator
     * @param ManagerRegistry $doctrine
     */
    public function __construct(Generator $generator, ManagerRegistry $doctrine)
    {
        parent::__construct($generator);
        $this->doctrine = $doctrine;
    }

    public function entity_reference($class, $id)
    {
        return $this->doctrine->getManager()->find($class, $id);
    }
}
