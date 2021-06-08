<?php

namespace App\Tests\Behat\Context\Traits;

use App\Tests\Behat\Manager\ReferenceManager;
use DAMA\DoctrineTestBundle\Doctrine\DBAL\StaticDriver;

trait HookContextTrait
{
    /**
     * @BeforeSuite
     */
    public static function beforeSuite()
    {
        StaticDriver::setKeepStaticConnections(true);
    }

    /**
     * @BeforeScenario
     */
    public function beforeScenario()
    {
        /** Init default content-type */
        $this->requestManager->setRequestHeader("content-type", "application/ld+json");
        StaticDriver::beginTransaction();
    }

    /**
     * @AfterScenario
     */
    public function afterScenario()
    {
        $this->requestManager->resetRequestHeaders();
        StaticDriver::rollBack();
        ReferenceManager::removeAllReferences();
    }

    /**
     * @AfterSuite
     */
    public static function afterSuite()
    {
        StaticDriver::setKeepStaticConnections(false);
    }
}
