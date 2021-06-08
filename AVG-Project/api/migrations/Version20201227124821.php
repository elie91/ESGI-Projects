<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201227124821 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        $this->addSql('ALTER TABLE event ADD status VARCHAR(255) NOT NULL DEFAULT \'CREATED\'');
        $this->addSql('ALTER TABLE home ADD status VARCHAR(255) NOT NULL DEFAULT \'CREATED\'');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('ALTER TABLE event DROP status');
        $this->addSql('ALTER TABLE home DROP status');
    }
}
