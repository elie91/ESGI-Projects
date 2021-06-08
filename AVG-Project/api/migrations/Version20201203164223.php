<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201203164223 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE event ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE event ALTER start_date DROP DEFAULT');
        $this->addSql('ALTER TABLE event ALTER end_date DROP DEFAULT');
        $this->addSql('ALTER TABLE home ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE home ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE picture ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE picture ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE rent ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE rent ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT \'2020-11-05\'');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE picture DROP created_at');
        $this->addSql('ALTER TABLE picture DROP updated_at');
        $this->addSql('ALTER TABLE home DROP created_at');
        $this->addSql('ALTER TABLE home DROP updated_at');
        $this->addSql('ALTER TABLE rent DROP created_at');
        $this->addSql('ALTER TABLE rent DROP updated_at');
        $this->addSql('ALTER TABLE event DROP created_at');
        $this->addSql('ALTER TABLE event DROP updated_at');
        $this->addSql('ALTER TABLE event ALTER start_date SET DEFAULT \'2020-11-05\'');
        $this->addSql('ALTER TABLE event ALTER end_date SET DEFAULT \'2020-11-05\'');
    }
}
