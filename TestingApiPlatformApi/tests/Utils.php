<?php

namespace App\Tests;

use Symfony\Component\PropertyAccess\PropertyAccessor;

class Utils
{
    /**
     * Get an item from an array using "dot" notation.
     *
     * Adapted further in this project
     *
     * @param array $array
     * @param string $propertyPath
     * @return mixed
     * @throws \Exception
     * @copyright   Taylor Otwell
     * @link        http://laravel.com/docs/helpers
     */
    public static function arrayGet($array, $propertyPath)
    {
        $propertyAccessor = new PropertyAccessor();
        return $propertyAccessor->getValue($array, $propertyPath);
    }


    /**
     * Same as arrayGet (handles dot.operators), but just returns a boolean
     *
     * @param $array
     * @param $propertyPath
     * @return boolean
     * @throws \Exception
     */
    public static function arrayHas($array, $propertyPath)
    {
        $propertyAccessor = new PropertyAccessor();
        return $propertyAccessor->isReadable($array, $propertyPath);
    }

    /**
     * @param $array
     * @param $propertyPath
     * @throws \Exception
     */
    public static function arrayDelete(&$array, $propertyPath) {
        $exploded = explode('.', $propertyPath);
        $key = array_shift($exploded);
        if (isset($array[$key])) {
            if (!count($exploded)) unset($array[$key]);
            else if(is_array($array[$key])) {
                static::arrayDelete($array[$key], implode('.', $exploded));
            } else throw new \Exception('not an array');
        } else {
            throw new \Exception($key . ' property not found');
        }
    }

    /**
     * Interpolate
     *
     * @param string $string
     * @param object|array $objectOrArray
     * @return string|string[]|null
     */
    public static function interpolate(string $string, $objectOrArray): string
    {
        return preg_replace_callback(
            '/{{([^{}]+)}}/',
            fn($matches) => Utils::arrayGet($objectOrArray, trim($matches[1])),
            $string
        );
    }

    /**
     * @param $input
     * @return string
     * @throws \Exception
     */
    public static function prettifyJson($input)
    {
        $decodedJson = json_decode($input);

        if ($decodedJson === null) { // JSON is invalid
            return $input;
        }

        return json_encode($decodedJson, JSON_PRETTY_PRINT);
    }
}