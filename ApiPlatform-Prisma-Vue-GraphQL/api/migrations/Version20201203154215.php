<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201203154215 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql("ALTER TABLE event ADD start_date DATE NOT NULL DEFAULT '2020-11-05 08:47:02' " );
        $this->addSql("ALTER TABLE event ADD end_date DATE NOT NULL DEFAULT '2020-11-05 08:47:02'");
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event DROP start_date');
        $this->addSql('ALTER TABLE event DROP end_date');
    }
}
