<?php

namespace App\Tests\Behat\Context;

use App\Tests\Behat\Context\Traits\{HeaderContextTrait, HookContextTrait, PayloadContextTrait, RequestContextTrait};
use Behat\Behat\Context\Context;
use Behat\Behat\Hook\Scope\AfterScenarioScope;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Behat\Testwork\Tester\Result\TestResult;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\FrameworkBundle\Test\TestContainer;
use Symfony\Component\HttpKernel\KernelInterface;
use App\Tests\Behat\Manager\{FixtureManager, OutputManager, RequestManager};
use App\Tests\Utils;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use function PHPUnit\Framework\assertContains;
use function PHPUnit\Framework\assertCount;
use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertFalse;
use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertNotContains;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;
use function PHPUnit\Framework\assertTrue;
use function PHPUnit\Framework\isType;

require_once __DIR__ . '/../../../vendor/phpunit/phpunit/src/Framework/Assert/Functions.php';

class ApiFeatureContext extends TestCase implements Context
{
    use HookContextTrait;
    use RequestContextTrait;
    use PayloadContextTrait;
    use HeaderContextTrait;

    /**
     * @var RequestManager
     */
    private RequestManager $requestManager;

    /**
     * @var FixtureManager
     */
    private FixtureManager $fixtureManager;

    /**
     * @var object|TestContainer|null
     */
    private $container;

    /**
     * ApiFeatureContext constructor.
     * @param KernelInterface $kernel
     * @param RequestManager $requestManager
     * @param FixtureManager $fixtureManager
     */
    public function __construct(KernelInterface $kernel, RequestManager $requestManager, FixtureManager $fixtureManager)
    {
        parent::__construct();

        $this->container = $kernel->getContainer()->get('test.service_container');
        $this->requestManager = $requestManager;
        $this->fixtureManager = $fixtureManager;
    }

    /**
     * @AfterScenario
     * @param AfterScenarioScope $scope
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws \Exception
     */
    public function printLastResponseOnError(AfterScenarioScope $scope)
    {
        if ($scope->getTestResult()->getResultCode() == TestResult::FAILED) {
            if ($this->requestManager->getLastResponse() === null) {
                return;
            }

            $body = $this->requestManager->getLastResponse()->getContent(false);

            OutputManager::printDebug('');
            OutputManager::printDebug('<error>Failure!</error> when making the following request:');
            OutputManager::printDebug('<fg=magenta>========></>');
            OutputManager::printRequest($this->requestManager->getLastRequest());

            OutputManager::printDebug('<fg=magenta><========</>');
            if (in_array($this->requestManager->getLastResponse()->getHeaders(false)['content-type'], ['application/json', 'application/ld+json'])) {
                OutputManager::printDebug(Utils::prettifyJson($body));
            } else {
                // the response is HTML - see if we should print all of it or some of it
                $isValidHtml = strpos($body, '</body>') !== false;

                if ($isValidHtml) {
                    OutputManager::printDebug('<error>Failure!</error> Below is a summary of the HTML response from the server.');

                    // finds the h1 and h2 tags and prints them only
                    $crawler = new \Symfony\Component\DomCrawler\Crawler($body);
                    foreach ($crawler->filter('h1, h2')->extract(array('_text')) as $header) {
                        OutputManager::printDebug(sprintf('        ' . $header));
                    }
                } else {
                    OutputManager::printDebug($body);
                }
            }
        }
    }

    /**
     * @Given /^the fixtures file "([^"]*)" is loaded$/
     */
    public function theFixturesFileIsLoaded(string $file)
    {
        $this->fixtureManager->load(['./tests/Behat/Fixtures/' . $file . '.yml']);
    }

    /**
     * @Given the following fixtures files are loaded:
     */
    public function theFixturesFilesAreLoaded(TableNode $table)
    {
        $files = array_map(fn($row) => './tests/Behat/Fixtures/' . $row[0] . '.yml', $table->getRows());

        $this->fixtureManager->load($files);
    }

    /**
     * @Then /^the "([^"]*)" property should equal "([^"]*)"$/
     * @param $property
     * @param $expectedValue
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyEquals($property, $expectedValue)
    {
        $payload = $this->requestManager->getScopePayload();
        $actualValue = Utils::arrayGet($payload, $property);

        assertEquals(
            $expectedValue,
            $actualValue,
            "Asserting the [$property] property in current scope equals [$expectedValue]: " . json_encode($payload)
        );
    }


    /**
     * @Then /^the response status code should be (?P<code>\d+)$/
     * @throws \Exception
     * @throws TransportExceptionInterface
     */
    public function theResponseStatusCodeShouldBe($statusCode)
    {
        $response = $this->requestManager->getLastResponse();

        assertEquals($statusCode,
            $response->getStatusCode(),
            sprintf('Expected status code "%s" does not match observed status code "%s"', $statusCode, $response->getStatusCode()));
    }

    /**
     * @Then /^the "([^"]*)" property should contain "([^"]*)"$/
     * @param $property
     * @param $expectedValue
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyShouldContain($property, $expectedValue)
    {
        $payload = $this->requestManager->getScopePayload();
        $actualValue = Utils::arrayGet($payload, $property);

        // if the property is actually an array, use JSON so we look in it deep
        $actualValue = is_array($actualValue) ? json_encode($actualValue, JSON_PRETTY_PRINT) : $actualValue;
        assertContains(
            $expectedValue,
            $actualValue,
            "Asserting the [$property] property in current scope contains [$expectedValue]: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should not contain "([^"]*)"$/
     * @param $property
     * @param $expectedValue
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyShouldNotContain($property, $expectedValue)
    {
        $payload = $this->requestManager->getScopePayload();
        $actualValue = Utils::arrayGet($payload, $property);

        // if the property is actually an array, use JSON so we look in it deep
        $actualValue = is_array($actualValue) ? json_encode($actualValue, JSON_PRETTY_PRINT) : $actualValue;
        assertNotContains(
            $expectedValue,
            $actualValue,
            "Asserting the [$property] property in current scope does not contain [$expectedValue]: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should exist$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyExists($property)
    {
        $payload = $this->requestManager->getScopePayload();

        $message = sprintf(
            'Asserting the [%s] property exists in the scope [%s]: %s',
            $property,
            $this->requestManager->getScope(),
            json_encode($payload)
        );

        assertTrue(Utils::arrayHas($payload, $property), $message);
    }

    /**
     * @Then /^the "([^"]*)" property should not exist$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyDoesNotExist($property)
    {
        $payload = $this->requestManager->getScopePayload();

        $message = sprintf(
            'Asserting the [%s] property does not exist in the scope [%s]: %s',
            $property,
            $this->requestManager->getScope(),
            json_encode($payload)
        );

        assertFalse(Utils::arrayHas($payload, $property), $message);
    }

    /**
     * @Then /^the "([^"]*)" property should be an array$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAnArray($property)
    {
        $payload = $this->requestManager->getScopePayload();

        $actualValue = Utils::arrayGet($payload, $property);

        assertTrue(
            is_array($actualValue),
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is an array: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be an array with "([^"]*)" data$/
     * @param $property
     * @param $numberOfData
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAnArrayWithCountData($property, $numberOfData)
    {
        $payload = $this->requestManager->getScopePayload();

        $actualValue = Utils::arrayGet($payload, $property);

        assertTrue(
            is_array($actualValue),
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is an array: " . json_encode($payload)
        );

        assertCount(
            $numberOfData,
            $actualValue,
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is an array with $numberOfData : " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be an object$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAnObject($property)
    {
        $payload = $this->requestManager->getScopePayload();

        $actualValue = Utils::arrayGet($payload, $property);

        assertTrue(
            is_object($actualValue),
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is an object: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be an empty array$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAnEmptyArray($property)
    {
        $payload = $this->requestManager->getScopePayload();
        $scopePayload = Utils::arrayGet($payload, $property);

        assertTrue(
            is_array($scopePayload) and $scopePayload === array(),
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is an empty array: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should contain (\d+) item(?:|s)$/
     * @param $property
     * @param $count
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyContainsItems($property, $count)
    {
        $payload = $this->requestManager->getScopePayload();

        assertCount(
            $count,
            Utils::arrayGet($payload, $property),
            "Asserting the [$property] property contains [$count] items: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be an integer$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAnInteger($property)
    {
        $payload = $this->requestManager->getScopePayload();

        isType(
            'int',
            Utils::arrayGet($payload, $property),
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is an integer: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be a string$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAString($property)
    {
        $payload = $this->requestManager->getScopePayload();

        isType(
            'string',
            Utils::arrayGet($payload, $property),
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is a string: " . json_encode($payload)
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be null$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsNull($property)
    {
        $payload = $this->requestManager->getScopePayload();

        assertNull(
            Utils::arrayGet($payload, $property),
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is not null."
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be a string equalling "([^"]*)"$/
     * @param $property
     * @param $expectedValue
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAStringEqualling($property, $expectedValue)
    {
        $payload = $this->requestManager->getScopePayload();

        $this->thePropertyIsAString($property);

        $actualValue = Utils::arrayGet($payload, $property);

        assertSame(
            $actualValue,
            $expectedValue,
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is a string equalling [$expectedValue]."
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be a boolean$/
     * @param $property
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsABoolean($property)
    {
        $payload = $this->requestManager->getScopePayload();

        assertTrue(
            gettype(Utils::arrayGet($payload, $property)) == 'boolean',
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is a boolean."
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be a boolean equalling "([^"]*)"$/
     * @param $property
     * @param $expectedValue
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsABooleanEqualling($property, $expectedValue)
    {
        $payload = $this->requestManager->getScopePayload();
        $actualValue = Utils::arrayGet($payload, $property);

        if (!in_array($expectedValue, array('true', 'false'))) {
            throw new \InvalidArgumentException("Testing for booleans must be represented by [true] or [false].");
        }

        $this->thePropertyIsABoolean($property);

        assertSame(
            $actualValue,
            $expectedValue == 'true',
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is a boolean equalling [$expectedValue]."
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be an integer equalling "([^"]*)"$/
     * @param $property
     * @param $expectedValue
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsAIntegerEqualling($property, $expectedValue)
    {
        $payload = $this->requestManager->getScopePayload();
        $actualValue = Utils::arrayGet($payload, $property);

        $this->thePropertyIsAnInteger($property);

        assertSame(
            $actualValue,
            (int)$expectedValue,
            "Asserting the [$property] property in current scope [{$this->requestManager->getScope()}] is an integer equalling [$expectedValue]."
        );
    }

    /**
     * @Then /^the "([^"]*)" property should be either:$/
     * @param $property
     * @param PyStringNode $options
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function thePropertyIsEither($property, PyStringNode $options)
    {
        $payload = $this->requestManager->getScopePayload();
        $actualValue = Utils::arrayGet($payload, $property);

        $valid = explode("\n", (string)$options);

        assertTrue(
            in_array($actualValue, $valid),
            sprintf(
                "Asserting the [%s] property in current scope [{$this->requestManager->getScope()}] is in array of valid options [%s].",
                $property,
                implode(', ', $valid)
            )
        );
    }

    /**
     * @Then /^print last response$/
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function printLastResponse()
    {
        OutputManager::printDebug($this->requestManager->debugLastResponse());
    }

    /**
     * @Then /^the array should contain "([^"]*)"$/
     * @param $arg1
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function theArrayShouldContain($arg1)
    {
        $payload = $this->requestManager->getScopePayload();
        $criteria = Utils::parseCriteria($arg1);
        $filteredPayload = array_filter($payload, fn($item) => Utils::isValid($item, $criteria));

        assertGreaterThan(0, count($filteredPayload));
    }

    /**
     * @Then /^the array should not contain "([^"]*)"$/
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function theArrayShouldNotContain($arg1)
    {
        $payload = $this->requestManager->getScopePayload();
        $criteria = Utils::parseCriteria($arg1);
        $filteredPayload = array_filter($payload, fn($item) => Utils::isValid($item, $criteria));

        assertEquals(0, count($filteredPayload));
    }

    /**
     * @Then /^stop test for debug$/
     */
    public function stopTestForDebug()
    {
        assertFalse(true);
    }
}
