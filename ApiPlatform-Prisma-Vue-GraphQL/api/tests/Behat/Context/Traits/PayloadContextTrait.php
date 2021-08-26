<?php

namespace App\Tests\Behat\Context\Traits;

use App\Tests\Behat\Manager\ReferenceManager;
use App\Tests\Utils;
use Behat\Gherkin\Node\PyStringNode;
use Symfony\Component\PropertyAccess\PropertyAccessor;

trait PayloadContextTrait
{
    /**
     * @Given I have the payload
     * @param PyStringNode $requestPayload
     */
    public function iHaveThePayload(PyStringNode $requestPayload)
    {
        $requestPayload = Utils::interpolate($requestPayload->getRaw(), ReferenceManager::getReferences());
        $this->requestManager->setRequestPayload(json_decode($requestPayload));
        $this->requestManager->setRequestReferencePayload(json_decode($requestPayload));
    }

    /**
     * @Given /^I have the payload from reference "([^"]*)"$/
     * @param $key
     */
    public function iHaveThePayloadFromReference($key)
    {
        $requestPayload = ReferenceManager::getReference($key);
        $this->requestManager->setRequestPayload($requestPayload);
        $this->requestManager->setRequestReferencePayload($requestPayload);
    }

    /**
     * @Given I reset the payload
     */
    public function iResetThePayload()
    {
        $this->requestManager->setRequestPayload(clone $this->requestManager->getRequestReferencePayload());
    }

    /**
     * @Given /^I change payload property "([^"]*)" with value "([^"]*)"$/
     * @param $propertyPath
     * @param $value
     */
    public function iChangePayloadPropertyWith($propertyPath, $value)
    {
        $payload = $this->requestManager->getRequestPayload();
        $propertyAccessor = new PropertyAccessor();
        $propertyAccessor->setValue($payload, $propertyPath, $value === "null" ? null : $value);
        $this->requestManager->setRequestPayload(clone $payload);
    }

    /**
     * @Given I merge into the payload
     * @param PyStringNode $mergePayload
     */
    public function iMergePayloadsPropertyWith(PyStringNode $mergePayload)
    {
        $mergePayload = json_decode($mergePayload, true);
        $mergeResult = array_merge_recursive((array)$this->requestManager->getRequestPayload(), $mergePayload);
        $mergeResultStdClass = json_decode(json_encode($mergeResult));
        $this->requestManager->setRequestPayload($mergeResultStdClass);
    }

    /**
     * @Given /^I delete payload property "([^"]*)"$/
     * @param $propertyPath
     * @throws \Exception
     */
    public function iDeletePayloadPropertyWith($propertyPath)
    {
        $payload = $this->requestManager->getRequestPayload();
        Utils::arrayDelete($payload, $propertyPath);
        $this->requestManager->setRequestPayload($payload);
    }

    /**
     * @Then /^scope into the first "([^"]*)" property$/
     * @param $scope
     */
    public function scopeIntoTheFirstProperty($scope)
    {
        $this->requestManager->scope = "{$scope}.0";
    }

    /**
     * @Then /^scope into the "([^"]*)" property$/
     * @param $scope
     */
    public function scopeIntoTheProperty($scope)
    {
        $this->requestManager->setScope($scope);
    }

    /**
     * @Then /^reset scope$/
     */
    public function resetScope()
    {
        $this->requestManager->setScope(null);
    }
}
