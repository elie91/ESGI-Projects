<?php

namespace App\Tests\Behat\Context\Traits;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertTrue;

trait HeaderContextTrait
{
    /**
     * @Given /^I set the "([^"]*)" header to be "([^"]*)"$/
     */
    public function iSetTheHeaderToBe($headerName, $value)
    {
        $this->requestManager->setRequestHeader($headerName, $value);
    }

    /**
     * @Given /^the "([^"]*)" header should be "([^"]*)"$/
     * @param $headerName
     * @param $expectedHeaderValue
     */
    public function theHeaderShouldBe($headerName, $expectedHeaderValue)
    {
        $response = $this->requestManager->getLastResponse();

        assertEquals($expectedHeaderValue, (string)$response->getHeaders(false)[$headerName] ?? null);
    }

    /**
     * @Given /^the "([^"]*)" header should exist$/
     * @param $headerName
     */
    public function theHeaderShouldExist($headerName)
    {
        $response = $this->requestManager->getLastResponse();

        assertTrue(isset($response->getHeaders(false)[$headerName]));
    }
}
