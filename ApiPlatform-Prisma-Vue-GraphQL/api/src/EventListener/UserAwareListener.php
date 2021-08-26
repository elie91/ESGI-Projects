<?php

namespace App\EventListener;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Annotation\UserAware;
use App\Entity\Event;
use App\Entity\Home;
use App\Entity\Notification;
use App\Entity\Rent;
use App\Entity\User;
use Doctrine\Common\Annotations\Reader;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final class UserAwareListener implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
  private TokenStorageInterface $tokenStorage;
  private AuthorizationCheckerInterface $authorizationChecker;
  private Reader $reader;
  private $fieldName;
  private $annotation;
  private array $aliases = [];

  public function __construct(TokenStorageInterface $tokenStorage, AuthorizationCheckerInterface $checker, Reader $reader)
  {
    $this->tokenStorage = $tokenStorage;
    $this->authorizationChecker = $checker;
    $this->reader = $reader;
  }

  /**
   * @param QueryBuilder $queryBuilder
   * @param QueryNameGeneratorInterface $queryNameGenerator
   * @param string $resourceClass
   * @param string|null $operationName
   */
  public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
  {
    if (!$this->supportClass($resourceClass)) return;

    $this->process($queryBuilder);
  }

  /**
   * @param QueryBuilder $queryBuilder
   * @param QueryNameGeneratorInterface $queryNameGenerator
   * @param string $resourceClass
   * @param array $identifiers
   * @param string|null $operationName
   * @param array $context
   * @throws \ReflectionException
   */
  public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
  {
    if (!$this->supportClass($resourceClass)) return;
    if ($this->exceptUrls($this->annotation->exceptUrls, $context)) return;

    $this->process($queryBuilder);
  }

  /**
   *
   * @param QueryBuilder $queryBuilder
   */
  private function process(QueryBuilder $queryBuilder)
  {
    $user = $this->tokenStorage->getToken()->getUser();
    $rootAlias = $queryBuilder->getRootAliases()[0];
    $filters = [];

    if ($user instanceof User) {

      if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {

        if ($this->authorizationChecker->isGranted('ROLE_RENTER')) {
          if ($queryBuilder->getRootEntities()[0] === Home::class && strlen($rootAlias) === 1) {
            $this->checkOwner($queryBuilder, $rootAlias, $user);
            return;
          }

          if ($queryBuilder->getRootEntities()[0] === Rent::class && strlen($rootAlias) === 1) {
            $this->checkHomeOwner($queryBuilder, $rootAlias, $user);
            return;
          }

          if ($queryBuilder->getRootEntities()[0] === Event::class && strlen($rootAlias) === 1) {
            $this->checkEventHomeOwner($queryBuilder, $rootAlias, $user);
            return;
          }
        }

        if ($queryBuilder->getRootEntities()[0] === Notification::class && strlen($rootAlias) === 1) {
          $this->checkOwner($queryBuilder, $rootAlias, $user);
          return;
        }

        if ($queryBuilder->getRootEntities()[0] === Home::class && strlen($rootAlias) === 1) {
          $this->displayVerifiedHome($queryBuilder, $rootAlias);
          return;
        }

        foreach ($this->fieldName as $field) {
          if (strpos($field, '.') !== false) {
            ["alias" => $alias, "field" => $field] = $this->addJoin($field, $rootAlias, $queryBuilder);
          }
          $filters = array_merge($filters, $this->addWhere($field, $alias ?? $rootAlias, $queryBuilder, $user));
          unset($alias);
        }

        $queryBuilder->andWhere(
          $queryBuilder
            ->expr()
            ->orX()->addMultiple($filters)
        );

        $queryBuilder->setParameter('current_user', $user->getId());

      }

    } else {

      if ($queryBuilder->getRootEntities()[0] === Home::class && strlen($rootAlias) === 1) {
        $this->displayVerifiedHome($queryBuilder, $rootAlias);
        return;
      }
    }
  }

  /**
   * @param string $field
   * @param string $alias
   * @param QueryBuilder $queryBuilder
   *
   * @return array
   */
  private function addJoin(string $field, string $alias, QueryBuilder $queryBuilder): array
  {
    $parts = explode('.', $field);
    $joinAlias = "";
    $previousAlias = $alias;
    while (count($parts) !== 1) {
      $joinField = array_shift($parts);
      $joinAlias .= (strlen($joinAlias) ? "_" : "") . $joinField;
      if (!in_array($joinAlias, $this->aliases)) {
        $queryBuilder->leftJoin("${previousAlias}.${joinField}", $joinAlias);
        $this->aliases[] = $joinAlias;
      }
      $previousAlias = $joinAlias;
    }

    return ['field' => array_shift($parts), 'alias' => $joinAlias];
  }

  /**
   *
   * @param string|null $field
   * @param string $alias
   * @param QueryBuilder $queryBuilder
   * @param User $user
   * @return array
   */
  private function addWhere(?string $field, string $alias, QueryBuilder $queryBuilder, User $user): array
  {
    if (preg_match("/_?events?$/", $alias) === 1 || ($queryBuilder->getRootEntities()[0] === Event::class && strlen($alias) === 1)) {
      /*$queryBuilder->leftJoin("${alias}.products", 'products');

      return [
          $queryBuilder
              ->expr()->eq(sprintf('%s.%s', $alias, $field), ':current_user'),
          $queryBuilder
              ->expr()->in('products.restaurant', ':current_user'),
      ];*/
      return [];
    } else {
      return [
        sprintf('%s.%s = :current_user', $alias, $field)
      ];
    }
  }

  private function checkOwner(QueryBuilder $builder, string $rootAlias, User $user)
  {
    $builder->andWhere(
      $builder->expr()->orX()->addMultiple([
        $builder->expr()
          ->eq("{$rootAlias}.owner", ':current_user'),
      ]));

    $builder->setParameter('current_user', $user->getId());
  }

  private function checkHomeOwner(QueryBuilder $builder, string $rootAlias, User $user)
  {
    $builder->innerJoin("{$rootAlias}.home", 'home');

    $this->checkOwner($builder, 'home', $user);

  }

  private function checkEventHomeOwner(QueryBuilder $builder, string $rootAlias, User $user)
  {
    $builder->innerJoin("{$rootAlias}.rent", 'rent');
    $this->checkHomeOwner($builder, 'rent', $user);
  }

  private function displayVerifiedHome(QueryBuilder $builder, string $rootAlias)
  {
    $builder->andWhere(
      $builder->expr()->orX()->addMultiple([
        $builder->expr()
          ->eq("{$rootAlias}.status", ':status'),
      ]));

    $builder->setParameter('status', Home::VERIFIED);

  }

  /**
   * @param $resourceClass
   * @return bool
   */
  private function supportClass($resourceClass): bool
  {
    /** @var UserAware $userAware */
    $userAware = $this->reader->getClassAnnotation(new \ReflectionClass($resourceClass), UserAware::class);
    if (!$userAware) {
      return false;
    }

    if ($userAware->userFieldNames && count($userAware->userFieldNames)) {
      $this->fieldName = $userAware->userFieldNames;
    } else {
      $this->fieldName = [$userAware->userFieldName];
    }

    $this->annotation = $userAware;

    return true;
  }

  /**
   * @param array $exceptUrls
   * @param array $context
   *
   * @return bool
   */
  private function exceptUrls(array $exceptUrls, array $context): bool
  {
    foreach ($exceptUrls as $except) {
      if (preg_match('/' . $except . '/', $context['request_uri'])) {
        return true;
      }
    }

    return false;
  }
}
