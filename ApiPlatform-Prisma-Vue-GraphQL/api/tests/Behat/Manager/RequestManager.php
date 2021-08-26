<?php

namespace App\Tests\Behat\Manager;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\{Client, Response};
use Symfony\Component\HttpKernel\KernelInterface;
use App\Tests\Utils;
use Symfony\Contracts\HttpClient\Exception\{ClientExceptionInterface, RedirectionExceptionInterface, ServerExceptionInterface, TransportExceptionInterface};

class RequestManager
{
    /**
     * Payload of the request
     *
     * @var \stdClass
     */
    private $requestPayload;

    /**
     * Payload of the request init on Given I have the payload
     *
     * @var \stdClass
     */
    private $requestReferencePayload;

    /**
     * Headers sent with request
     *
     * @var array[]
     */
    private $requestHeaders = [];

    /**
     * The last request that was used to make the response
     *
     * @var \GuzzleHttp\Psr7\Request
     */
    private $lastRequest;

    /**
     * The response of the HTTP request
     *
     * @var Response
     */
    private $lastResponse;

    /**
     * Payload of the response
     *
     * @var string
     */
    private $responsePayload;

    /**
     * Scope of the response
     *
     * @var string
     */
    private $scope;

    /**
     * The Guzzle client
     *
     * @var Client
     */
    private $client;

    public function __construct(KernelInterface $kernel)
    {
        $this->client = $kernel->getContainer()->get('test.api_platform.client');
    }

    /**
     * @return string
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function debugLastResponse()
    {
        if ($this->lastResponse) {

            // Build the first line of the response (protocol, protocol version, statuscode, reason phrase)
            $response = 'HTTP/1.1 ' . $this->lastResponse->getStatusCode() . "\r\n";

            // Add the headers
            foreach ($this->lastResponse->getHeaders(false) as $key => $value) {
                $response .= sprintf("%s: %s\r\n", $key, $value[0]);
            }

            // Add the response body
            $response .= Utils::prettifyJson($this->lastResponse->getContent(false));

            return $response;
        }
    }

    /**
     * @return \stdClass
     */
    public function getRequestPayload(): ?\stdClass
    {
        return $this->requestPayload;
    }

    /**
     * @param \stdClass $requestPayload
     * @return RequestManager
     */
    public function setRequestPayload(\stdClass $requestPayload): RequestManager
    {
        $this->requestPayload = $requestPayload;
        return $this;
    }

    /**
     * @return \stdClass
     */
    public function getRequestReferencePayload(): \stdClass
    {
        return $this->requestReferencePayload;
    }

    /**
     * @param \stdClass $requestReferencePayload
     * @return RequestManager
     */
    public function setRequestReferencePayload(\stdClass $requestReferencePayload): RequestManager
    {
        $this->requestReferencePayload = $requestReferencePayload;
        return $this;
    }

    /**
     * @return array[]
     */
    public function getRequestHeaders(): array
    {
        return $this->requestHeaders;
    }

    /**
     * @param string $key
     * @param string $value
     * @return RequestManager
     */
    public function setRequestHeader(string $key, string $value): RequestManager
    {
        $this->requestHeaders[$key] = $value;
        return $this;
    }

    /**
     * Reset Request Headers
     */
    public function resetRequestHeaders(): void
    {
        $this->requestHeaders = [];
    }

    /**
     * @return \GuzzleHttp\Psr7\Request
     */
    public function getLastRequest(): \GuzzleHttp\Psr7\Request
    {
        return $this->lastRequest;
    }

    /**
     * @param \GuzzleHttp\Psr7\Request $lastRequest
     * @return RequestManager
     */
    public function setLastRequest(\GuzzleHttp\Psr7\Request $lastRequest): RequestManager
    {
        $this->lastRequest = $lastRequest;
        return $this;
    }

    /**
     * Checks the response exists and returns it.
     *
     * @return Response
     * @throws \Exception
     */
    public function getLastResponse()
    {
        if (!$this->lastResponse) {
            throw new \Exception("You must first make a request to check a response.");
        }

        return $this->lastResponse;
    }

    /**
     * @param Response $lastResponse
     * @return RequestManager
     */
    public function setLastResponse(Response $lastResponse): RequestManager
    {
        $this->lastResponse = $lastResponse;
        return $this;
    }

    /**
     * Return the response payload from the current response.
     *
     * @return mixed|string
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws \Exception
     * @throws TransportExceptionInterface
     */
    protected function getResponsePayload()
    {
        $json = json_decode($this->getLastResponse()->getContent(false));
        if (json_last_error() !== JSON_ERROR_NONE) {
            $message = 'Failed to decode JSON body ';

            switch (json_last_error()) {
                case JSON_ERROR_DEPTH:
                    $message .= '(Maximum stack depth exceeded).';
                    break;
                case JSON_ERROR_STATE_MISMATCH:
                    $message .= '(Underflow or the modes mismatch).';
                    break;
                case JSON_ERROR_CTRL_CHAR:
                    $message .= '(Unexpected control character found).';
                    break;
                case JSON_ERROR_SYNTAX:
                    $message .= '(Syntax error, malformed JSON): ' . "\n\n" . $this->getLastResponse()->getContent(false);
                    break;
                case JSON_ERROR_UTF8:
                    $message .= '(Malformed UTF-8 characters, possibly incorrectly encoded).';
                    break;
                default:
                    $message .= '(Unknown error).';
                    break;
            }

            throw new \Exception($message);
        }

        $this->responsePayload = $json;
        return $this->responsePayload;
    }

    /**
     * @param string $responsePayload
     * @return RequestManager
     */
    public function setResponsePayload(string $responsePayload): RequestManager
    {
        $this->responsePayload = $responsePayload;
        return $this;
    }

    /**
     * Returns the payload from the current scope within
     * the response.
     *
     * @return mixed
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws \Exception
     * @throws TransportExceptionInterface
     */
    public function getScopePayload()
    {
        $payload = $this->getResponsePayload();

        if (!$this->scope) {
            return $payload;
        }

        return Utils::arrayGet($payload, (string)$this->scope, true);
    }

    /**
     * @return string
     */
    public function getScope()
    {
        return $this->scope;
    }

    /**
     * @param string|null $scope
     * @return RequestManager
     */
    public function setScope(?string $scope): RequestManager
    {
        $this->scope = $scope;
        return $this;
    }

    /**
     * @return Client
     */
    public function getClient(): Client
    {
        return $this->client;
    }

    /**
     * @param Client $client
     * @return RequestManager
     */
    public function setClient(Client $client): RequestManager
    {
        $this->client = $client;
        return $this;
    }
}