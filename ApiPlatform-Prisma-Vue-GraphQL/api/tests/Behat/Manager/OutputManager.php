<?php

namespace App\Tests\Behat\Manager;

use App\Tests\Utils;
use GuzzleHttp\Psr7\Request;
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

    public static function printRequest(Request $request)
    {
        $rHeaders = $request->getHeaders();
        try {
            self::printDebug(
                sprintf('<comment>%s</comment> <info>%s</info>', $request->getMethod(), $request->getUri()) . "\n"
                . implode("\n", array_map(fn($item, $key) => "<fg=cyan><fg=cyan;options=bold>{$key}</>: " . implode(', ', $item) . "</>", $rHeaders, array_keys($rHeaders))) . "\n"
            );
            self::printDebug("<fg=yellow>" . Utils::prettifyJson($request->getBody()->getContents()) . "</>");
        } catch (\Exception $e) {
            dump($e->getMessage());
        }
    }
}
