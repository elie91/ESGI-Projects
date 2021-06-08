<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200221221611 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE account ADD active BOOLEAN DEFAULT false NOT NULL');
        $this->addSql('ALTER TABLE account ADD deleted BOOLEAN DEFAULT false NOT NULL');
        $this->addSql('ALTER TABLE account ALTER name SET NOT NULL');
        $this->addSql('ALTER TABLE account ALTER firstname SET NOT NULL');
        $this->addSql('ALTER TABLE account ALTER terms DROP DEFAULT');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE account DROP active');
        $this->addSql('ALTER TABLE account DROP deleted');
        $this->addSql('ALTER TABLE account ALTER name DROP NOT NULL');
        $this->addSql('ALTER TABLE account ALTER firstname DROP NOT NULL');
        $this->addSql('ALTER TABLE account ALTER terms SET DEFAULT \'false\'');
    }
}
