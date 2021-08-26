<?php

namespace App\Tests\Behat\Manager;

class ReferenceManager
{
    const ARRAY_KEYS = ['id', '@id'];

    /**
     * @var \stdClass
     */
    static private $references;

    public function __construct()
    {
        self::$references = new \stdClass();
    }

    /**
     * @return \stdClass
     */
    public static function getReferences(): \stdClass
    {
        if (!self::$references) {
            self::$references = new \stdClass();
        }

        return self::$references;
    }

    /**
     * @param string $key
     * @return \stdClass
     */
    public static function getReference(string $key): \stdClass
    {
        return self::$references->$key;
    }

    /**
     * @param string $key
     * @param array $reference
     * @return void
     * @throws \Exception
     */
    public static function addReference(string $key, array $reference): void
    {
        if (!property_exists(self::getReferences(), $key)) {
            if (count(array_intersect(self::ARRAY_KEYS, array_keys($reference))) !== count(self::ARRAY_KEYS)) {
                throw new \Exception("Invalid reference key, expected : " . json_encode(self::ARRAY_KEYS));
            }

            self::$references->$key = (object)$reference;
        }
    }

    /**
     * Remove all references
     */
    public static function removeAllReferences()
    {
        self::$references = new \stdClass();
    }
}
