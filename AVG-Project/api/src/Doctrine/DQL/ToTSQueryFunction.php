<?php
namespace App\Doctrine\DQL;


use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\QueryException;
use Doctrine\ORM\Query\SqlWalker;

class ToTSQueryFunction extends FunctionNode
{
    private $dictionaryExpression;
    private $documentExpression;

    public function getSql(SqlWalker $sqlWalker)
    {
        return 'to_tsquery('
            . $this->dictionaryExpression->dispatch($sqlWalker) . ', '
            . $this->documentExpression->dispatch($sqlWalker)
            . ')';
    }

    /**
     * @param Parser $parser
     * @throws QueryException
     */
    public function parse(Parser $parser)
    {
        $parser->match(Lexer::T_IDENTIFIER); // (2)
        $parser->match(Lexer::T_OPEN_PARENTHESIS); // (3)
        $this->dictionaryExpression = $parser->ArithmeticPrimary(); // (4)
        $parser->match(Lexer::T_COMMA); // (5)
        $this->documentExpression = $parser->ArithmeticPrimary(); // (6)
        $parser->match(Lexer::T_CLOSE_PARENTHESIS); // (3)
    }

}
