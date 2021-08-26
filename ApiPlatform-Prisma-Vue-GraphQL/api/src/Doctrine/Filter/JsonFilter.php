<?php


namespace App\Doctrine\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;

class JsonFilter extends AbstractContextAwareFilter
{
    /**
     * {@inheritdoc}
     */
    public function apply(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null, array $context = [])
    {

        if (isset($context['filters']) && !isset($context['filters']['json'])) {
            return;
        }

        if (!isset($context['filters']['json']) || !is_array($context['filters']['json'])) {
            parent::apply($queryBuilder, $queryNameGenerator, $resourceClass, $operationName, $context);

            return;
        }

        $this->filterProperty('json', $context['filters']['json'], $queryBuilder, $queryNameGenerator, $resourceClass, $operationName);
    }

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        if ($property !== "json") return;
        // otherwise filter is applied to order and page as well
        /*if (!$this->isPropertyMapped('email', $resourceClass)) {
            return;
        }*/

        $alias = $queryBuilder->getRootAliases()[0];
        $field = $property;
        if ($this->isPropertyNested($property, $resourceClass)) {
            list($alias, $field) = $this->addJoinsForNestedProperty($property, $alias, $queryBuilder, $queryNameGenerator, $resourceClass);
        }

        $value = explode(' ', $value);
        $value = implode(' & ', $value);

        $query = $queryNameGenerator->generateParameterName($property); // Generate a unique parameter name to avoid collisions with other filters
        $queryBuilder
            ->andWhere(
                sprintf('JSON_CONTAINS(%s.roles, :%s) = TRUE', $alias, $query)
            );
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
