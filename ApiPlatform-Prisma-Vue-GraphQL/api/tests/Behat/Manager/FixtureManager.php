<?php

namespace App\Tests\Behat\Manager;

use ApiPlatform\Core\Api\IriConverterInterface;
use App\Entity\User;
use Fidry\AliceDataFixtures\Loader\PersisterLoader;
use Fidry\AliceDataFixtures\ProcessorInterface;
use Symfony\Component\HttpKernel\KernelInterface;

class FixtureManager implements ProcessorInterface
{
    /**
     * @var IriConverterInterface
     */
    private IriConverterInterface $iriConverter;

    /**
     * @var PersisterLoader
     */
    private $fixtureLoader;


    public function __construct(IriConverterInterface $iriConverter, KernelInterface $kernel)
    {
        $this->iriConverter = $iriConverter;
        $this->fixtureLoader = $kernel->getContainer()->get('fidry_alice_data_fixtures.loader.doctrine');
    }

    /**
     * @inheritdoc
     */
    public function preProcess(string $fixtureId, $object): void
    {
        // do nothing
    }

    /**
     * @inheritdoc
     * @throws \Exception
     */
    public function postProcess(string $fixtureId, $object): void
    {
        $reference = [
            'id' => (method_exists($object, 'getId')) ?$object->getId() : null,
            '@id' => $this->iriConverter->getIriFromItem($object)
        ];

        switch(get_class($object)) {
            case User::class:
                $reference['email'] = $object->getEmail();
                break;
        }
        ReferenceManager::addReference($fixtureId, $reference);
    }

    /**
     * Load Fixtures
     *
     * @param array $files
     */
    public function load(array $files): void
    {
        $this->fixtureLoader->load($files);
    }
}