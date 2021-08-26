<?php

namespace App\Tests\Behat\Context\Traits;

use App\Tests\Behat\Manager\ReferenceManager;
use Behat\Behat\Hook\Scope\AfterScenarioScope;
use Behat\Testwork\Tester\Result\TestResult;
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
     * @param AfterScenarioScope $scope
     */
    public function afterScenario(AfterScenarioScope $scope)
    {
        $STOP_ON_FAILURE = boolval(getenv('STOP_ON_FAILURE'));
        $this->requestManager->resetRequestHeaders();
        if ($scope->getTestResult()->getResultCode() !== TestResult::FAILED || !$STOP_ON_FAILURE) {
            StaticDriver::rollBack();
        } else {
            StaticDriver::commit();
            exit(1);
        }
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
