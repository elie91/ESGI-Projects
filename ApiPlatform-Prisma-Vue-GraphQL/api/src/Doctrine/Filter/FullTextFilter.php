<?php


namespace App\Doctrine\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;

class FullTextFilter extends AbstractContextAwareFilter
{
  /**
   * {@inheritdoc}
   */
  public function apply(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null, array $context = [])
  {

    if (isset($context['filters']) && !isset($context['filters']['full_text'])) {
      return;
    }

    if (!isset($context['filters']['full_text']) || !is_array($context['filters']['full_text'])) {
      parent::apply($queryBuilder, $queryNameGenerator, $resourceClass, $operationName, $context);

      return;
    }

    $this->filterProperty('full_text', $context['filters']['full_text'], $queryBuilder, $queryNameGenerator, $resourceClass, $operationName);
  }

  protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
  {
    if ($property !== "full_text") return;
    // otherwise filter is applied to order and page as well
    /*if (!$this->isPropertyMapped('email', $resourceClass)) {
        return;
    }*/

    $alias = $queryBuilder->getRootAliases()[0];
    $field = $property;
    dump($resourceClass);
    if ($this->isPropertyNested($property, $resourceClass)) {
      list($alias, $field) = $this->addJoinsForNestedProperty($property, $alias, $queryBuilder, $queryNameGenerator, $resourceClass);
    }

    $value = explode(' ', $value);
    $value = array_map(function ($item) {
      return trim($item) . ':*';
    }, $value);
    $value = implode(' & ', $value);

    $query = $queryNameGenerator->generateParameterName($property); // Generate a unique parameter name to avoid collisions with other filters
    switch ($resourceClass) {
      case "App\Entity\User":
        $queryBuilder
          ->andWhere(
            $queryBuilder->expr()->orX(
              sprintf("FULL_TEXT_SEARCH(TO_TSVECTOR('mydict', ${alias}.email), TO_TSQUERY('mydict', UNACCENT(:%s))) = TRUE", $query),
              sprintf("FULL_TEXT_SEARCH(TO_TSVECTOR('mydict', ${alias}.firstname), TO_TSQUERY('mydict', UNACCENT(:%s))) = TRUE", $query),
              sprintf("FULL_TEXT_SEARCH(TO_TSVECTOR('mydict', ${alias}.lastname), TO_TSQUERY('mydict', UNACCENT(:%s))) = TRUE", $query),
            )
          );
        break;
      case "App\Entity\Home":
        $queryBuilder
          ->andWhere(
            $queryBuilder->expr()->orX(
              sprintf("FULL_TEXT_SEARCH(TO_TSVECTOR('mydict', ${alias}.name), TO_TSQUERY('mydict', UNACCENT(:%s))) = TRUE", $query),
              sprintf("FULL_TEXT_SEARCH(TO_TSVECTOR('mydict', ${alias}.city), TO_TSQUERY('mydict', UNACCENT(:%s))) = TRUE", $query)
            )
          );
        break;
      default:
        break;

    }
    $queryBuilder->setParameter($query, $value);

  }

  // This function is only used to hook in documentation generators (supported by Swagger and Hydra)
  public function getDescription(string $resourceClass): array
  {
    if (!$this->properties) {
      return [];
    }

    $description = [];
    foreach ($this->properties as $property => $strategy) {
      $description["full_text"] = [
        'property' => "full_text",
        'type' => 'string',
        'required' => false,
      ];
    }

    return $description;
  }
}
