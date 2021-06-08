<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201205184058 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ALTER created_at DROP DEFAULT');
        $this->addSql('ALTER TABLE event ALTER updated_at DROP DEFAULT');
        $this->addSql('ALTER TABLE event_user DROP CONSTRAINT fk_92589ae27e3c61f9');
        $this->addSql('DROP INDEX idx_92589ae27e3c61f9');
        $this->addSql('ALTER TABLE event_user RENAME COLUMN owner_id TO user_id');
        $this->addSql('ALTER TABLE event_user ADD CONSTRAINT FK_92589AE2A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_92589AE2A76ED395 ON event_user (user_id)');
        $this->addSql('ALTER TABLE home ALTER created_at DROP DEFAULT');
        $this->addSql('ALTER TABLE home ALTER updated_at DROP DEFAULT');
        $this->addSql('ALTER TABLE picture ALTER created_at DROP DEFAULT');
        $this->addSql('ALTER TABLE picture ALTER updated_at DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER created_at DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER updated_at DROP DEFAULT');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event_user DROP CONSTRAINT FK_92589AE2A76ED395');
        $this->addSql('DROP INDEX IDX_92589AE2A76ED395');
        $this->addSql('ALTER TABLE event_user RENAME COLUMN user_id TO owner_id');
        $this->addSql('ALTER TABLE event_user ADD CONSTRAINT fk_92589ae27e3c61f9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_92589ae27e3c61f9 ON event_user (owner_id)');
        $this->addSql('ALTER TABLE event ALTER created_at SET DEFAULT \'2020-11-05 00:00:00\'');
        $this->addSql('ALTER TABLE event ALTER updated_at SET DEFAULT \'2020-11-05 00:00:00\'');
        $this->addSql('ALTER TABLE home ALTER created_at SET DEFAULT \'2020-11-05 00:00:00\'');
        $this->addSql('ALTER TABLE home ALTER updated_at SET DEFAULT \'2020-11-05 00:00:00\'');
        $this->addSql('ALTER TABLE picture ALTER created_at SET DEFAULT \'2020-11-05 00:00:00\'');
        $this->addSql('ALTER TABLE picture ALTER updated_at SET DEFAULT \'2020-11-05 00:00:00\'');
        $this->addSql('ALTER TABLE rent ALTER created_at SET DEFAULT \'2020-11-05 00:00:00\'');
        $this->addSql('ALTER TABLE rent ALTER updated_at SET DEFAULT \'2020-11-05 00:00:00\'');
    }
}
