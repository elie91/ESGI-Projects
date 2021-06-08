<?php

namespace App\Tests\Behat\Manager;

use Symfony\Component\Console\Output\ConsoleOutput;

class OutputManager
{
    /**
     * @var ConsoleOutput
     */
    private static $output;

    /**
     * @param $string
     */
    public static function printDebug($string)
    {
        self::getOutput()->writeln($string);
    }

    /**
     * @return ConsoleOutput
     */
    private static function getOutput()
    {
        if (self::$output === null) {
            self::$output = new ConsoleOutput();
        }

        return self::$output;
    }
}