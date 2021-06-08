<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201118223158 extends AbstractMigration
{
  public function getDescription(): string
  {
    return '';
  }

  public function up(Schema $schema): void
  {
    /*
    $this->addSql('CREATE SCHEMA IF NOT EXISTS management');
    $this->addSql('CREATE TABLE IF NOT EXISTS management."Project" (id VARCHAR(200) DEFAULT \'\' NOT NULL, secrets TEXT DEFAULT NULL, "allowQueries" BOOLEAN DEFAULT \'true\' NOT NULL, "allowMutations" BOOLEAN DEFAULT \'true\' NOT NULL, functions TEXT DEFAULT NULL, PRIMARY KEY(id))');
    //$this->addSql('CREATE TABLE IF NOT EXISTS management."Migration" (revision INT DEFAULT 1 NOT NULL, "projectId" VARCHAR(200) DEFAULT \'\' NOT NULL, schema TEXT DEFAULT NULL, functions TEXT DEFAULT NULL, status VARCHAR(20) DEFAULT \'PENDING\' NOT NULL, applied INT DEFAULT 0 NOT NULL, "rolledBack" INT DEFAULT 0 NOT NULL, steps TEXT DEFAULT NULL, errors TEXT DEFAULT NULL, "startedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, "finishedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, datamodel TEXT DEFAULT NULL, PRIMARY KEY(projectId, revision))');
    #s$this->addSql('CREATE INDEX IF NOT EXISTS IDX_62A85E20722AB53A ON management."Migration" ("projectId")');
    $this->addSql('CREATE TABLE IF NOT EXISTS management."InternalMigration" (id VARCHAR(255) NOT NULL, "appliedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE TABLE IF NOT EXISTS management."TelemetryInfo" (id VARCHAR(255) NOT NULL, "lastPinged" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE TABLE IF NOT EXISTS management."CloudSecret" (secret VARCHAR(255) NOT NULL, PRIMARY KEY(secret))');
    */
    //$this->addSql('ALTER TABLE management."Migration" ADD CONSTRAINT migrations_projectid_foreign FOREIGN KEY ("projectId") REFERENCES management."Project" (id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    #$this->addSql('ALTER TABLE management."Migration" ADD CONSTRAINT migrations_projectid_foreign FOREIGN KEY ("projectId") REFERENCES management."Project" (id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
  }

  public function down(Schema $schema): void
  {
    $this->addSql('ALTER TABLE management."Migration" DROP CONSTRAINT migrations_projectid_foreign');
    $this->addSql('DROP TABLE management."Project"');
    $this->addSql('DROP TABLE management."Migration"');
    $this->addSql('DROP TABLE management."InternalMigration"');
    $this->addSql('DROP TABLE management."TelemetryInfo"');
    $this->addSql('DROP TABLE management."CloudSecret"');
  }
}
