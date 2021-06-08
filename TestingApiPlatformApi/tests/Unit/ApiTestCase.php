<?php

namespace App\Tests;

use Doctrine\Bundle\FixturesBundle\Loader\SymfonyFixturesLoader;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\Common\DataFixtures\ReferenceRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTEncodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\KeyLoader\KeyLoaderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\KeyLoader\RawKeyLoader;
use PHPUnit\Runner\BaseTestRunner;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\TestContainer;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Output\StreamOutput;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ApiTestCase extends WebTestCase
{
	private $authorizationKey;
	private $debug;
	/** @var ReferenceRepository */
	private $referenceRepository;
	protected const RESOURCE_NOT_FOUND = 'not-found';
	private $application;

	public function __construct(?string $name = null, array $data = [], string $dataName = '')
	{
		parent::__construct($name, $data, $dataName);

		$level = (int)getenv('SHELL_VERBOSITY');
		$this->debug = $level !== -1;
	}

	protected function isDebug() {
		return $this->debug;
	}

	protected function setUp()
	{
		parent::setUp();

		if (!isset($_ENV['ORIGINAL_DATABASE_URL'])) {
			$_ENV['ORIGINAL_DATABASE_URL'] = $_ENV['DATABASE_URL'];
		}

		$_ENV['DATABASE_URL'] = str_replace('db/api', 'db/api_tests_' . uniqid(date('U')), $_ENV['ORIGINAL_DATABASE_URL']);

		if ($this->debug) {
			printf("Creating/Populating database '%s'\n", $_ENV['DATABASE_URL']);
		}

		static::bootKernel();

		$this->createDatabase();
	}

	protected function loadFixture(string $fixtureClass): ApiTestCase
	{
		$em = static::$container->get('doctrine')->getManager();

		$loader         = static::$container->get('doctrine.fixtures.loader');
		$fixtures       = $loader->getFixtures();
		$fixturesToLoad = [];

		foreach ($fixtures as $fixture) {
			$fixturesToLoad[] = $fixture;
			if (get_class($fixture) === $fixtureClass) {
				break;
			}
		}

		$purger   = new ORMPurger();
		$executor = new ORMExecutor($em, $purger);
		$executor->execute($fixturesToLoad);

		if (!$this->referenceRepository) {
			$this->referenceRepository = $executor->getReferenceRepository();
		}

		return $this;
	}

	protected function createDatabase()
	{
		$this->runCommand(['command' => 'doctrine:database:create']);
		$this->runCommand(['command' => 'doctrine:schema:create']);
	}

	protected function dropDatabase()
	{
		$this->runCommand(['command' => 'doctrine:database:drop', '--force' => 1]);
	}

	private function runCommand($params)
	{
		if (!$this->application) {
			$this->application = new Application(static::$kernel);
			$this->application->setAutoExit(false);
		}

		$input = new ArrayInput($params);

		// You can use NullOutput() if you don't need the output
		if ($this->debug) {
			$output = new BufferedOutput(OutputInterface::VERBOSITY_VERY_VERBOSE);
		} else {
			$output = new NullOutput();
		}

		if ($this->debug) {
			printf("Executing command: %s\n", implode(' ', $params));
		}
		$this->application->run($input, $output);

		if ($this->debug) {
			printf("Command result: %s\n", $output->fetch());
		}
	}

	protected function getFixtureReference($class, $resource)
	{
		if (!$this->referenceRepository) {
			throw new \LogicException("No fixture loaded");
		}

		$reference = $class . '::' . $resource;

		return $this->referenceRepository->getReference($reference);
	}

	protected function hasFixtureReference($class, $resource)
	{
		if (!$this->referenceRepository) {
			throw new \LogicException("No fixture loaded");
		}

		$reference = $class . '::' . $resource;

		return $this->referenceRepository->hasReference($reference);
	}

	protected function login($email, $password)
	{
		$client = static::createClient();
		$server = [
			'CONTENT_TYPE' => 'application/json',
			'HTTP_ACCEPT'  => 'application/json',
		];
		$client->request('POST', '/login_check', [], [], $server,
						 json_encode([
										 'email'    => $email,
										 'password' => $password,
									 ])
		);

		$this->assertEquals(200, $client->getResponse()->getStatusCode());
		$response = $client->getResponse()->getContent();
		$this->assertJson($response);
		$this->assertArrayHasKey('token', json_decode($response, true));
		$this->authorizationKey = 'Bearer ' . (string)(json_decode($response)->token);
	}

	protected function logout()
	{
		$this->authorizationKey = null;
	}

	protected function request($method, $uri, $data = [])
	{
		$server = [
			'CONTENT_TYPE' => 'application/json',
			'HTTP_ACCEPT'  => 'application/json',
		];

		if ($this->authorizationKey) {
			$server['HTTP_AUTHORIZATION'] = $this->authorizationKey;
		}

		$client = static::createClient([], $server);

		if ($this->debug) $client->enableProfiler();

		try {
			$client->request($method, $uri, [], [], $server, json_encode($data));
		} catch (\Exception $exception) {
			throw new \Exception($exception);
		}

		return $client;
	}

	protected function tearDown()
	{
		parent::tearDown();

		if ($this->getStatus() === BaseTestRunner::STATUS_PASSED) {
			if ($this->debug) {
				printf("Dropping database '%s'\n", $_ENV['DATABASE_URL']);
			}
			$this->dropDatabase();
		}
	}
}