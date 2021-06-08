<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200303160602 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('DROP SEQUENCE user_project_id_seq CASCADE');
        $this->addSql('ALTER TABLE user_project DROP id');
        $this->addSql('ALTER TABLE user_project ALTER user_id_id SET NOT NULL');
        $this->addSql('ALTER TABLE user_project ALTER project_id SET NOT NULL');
        $this->addSql('ALTER TABLE user_project ADD PRIMARY KEY (user_id_id, project_id)');
        $this->addSql('ALTER TABLE project ALTER ended DROP DEFAULT');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE user_project_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('ALTER TABLE project ALTER ended SET DEFAULT \'false\'');
        $this->addSql('DROP INDEX user_project_pkey');
        $this->addSql('ALTER TABLE user_project ADD id INT NOT NULL');
        $this->addSql('ALTER TABLE user_project ALTER user_id_id DROP NOT NULL');
        $this->addSql('ALTER TABLE user_project ALTER project_id DROP NOT NULL');
        $this->addSql('ALTER TABLE user_project ADD PRIMARY KEY (id)');
    }
}
