<?php

namespace App\Tests\Behat\Context\Traits;

use App\Tests\Behat\Manager\ReferenceManager;
use App\Tests\Utils;
use GuzzleHttp\Psr7\Request;

trait RequestContextTrait
{
    /**
     * @When /^I request "(GET|PUT|POST|DELETE) ([^"]*)"$/
     * @param $httpMethod
     * @param $resource
     */
    public function iRequest($httpMethod, $resource)
    {
        $resource = Utils::interpolate($resource, ReferenceManager::getReferences());

        $this->requestManager->setLastRequest(new Request(
            $httpMethod,
            $resource,
            $this->requestManager->getRequestHeaders(),
            json_encode($this->requestManager->getRequestPayload())
        ));

        $this->requestManager->setLastResponse($this->requestManager->getClient()->request(
            $this->requestManager->getLastRequest()->getMethod(),
            $this->requestManager->getLastRequest()->getUri(),
            [
                'headers' => $this->requestManager->getLastRequest()->getHeaders(),
                'body' => json_encode($this->requestManager->getRequestPayload()),
            ]
        ));
    }

    /**
     * @Given /^I add new reference "([^"]*)"$/
     * @param $key
     * @throws \Exception
     */
    public function addReference($key)
    {
        $payload = $this->requestManager->getScopePayload();
        $reference = [
            'id' => Utils::arrayGet($payload, 'id'),
            '@id' => Utils::arrayGet($payload, '@id'),
        ];
        ReferenceManager::addReference($key, $reference);
    }

    /**
     * @Given /^I add new full reference "([^"]*)"$/
     * @param $key
     * @throws \Exception
     */
    public function addFullReference($key)
    {
        $payload = $this->requestManager->getScopePayload();
        $reference = $payload;
        ReferenceManager::addReference($key, (array)$reference);
    }

    /**
     * @Given /^I authenticate with role "([^"]+)"$/
     * @param $userType
     *
     * @throws \Exception
     */
    public function iAuthenticateWithRole($userType)
    {
        $requestPayload = new \stdClass();
        $requestPayload->email = ReferenceManager::getReference($userType)->email;
        $requestPayload->password = 'test';
        $this->requestManager->setRequestPayload(clone $requestPayload);

        $this->requestManager->setRequestHeader('content-type', 'application/ld+json');
        $this->iRequest('POST', '/login_check');

        $payload = $this->requestManager->getScopePayload();
        $token = Utils::arrayGet($payload, 'token');
        [$header, $payload, $signature] = explode('.', $token);
        $this->requestManager->setRequestHeader('Authorization', 'Bearer ' . $token);

        $currentUser = json_decode(base64_decode($payload), true);
        $reference = [
            'id' => $currentUser['id'],
            '@id' => $currentUser['@id'],
        ];
        ReferenceManager::addReference('currentUser', $reference);
    }
}
