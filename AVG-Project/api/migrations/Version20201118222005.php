<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201118222005 extends AbstractMigration
{
  public function getDescription(): string
  {
    return '';
  }

  public function up(Schema $schema): void
  {
    // this up() migration is auto-generated, please modify it to your needs
    $this->addSql('CREATE SEQUENCE event_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE SEQUENCE event_user_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE SEQUENCE home_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE SEQUENCE option_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE SEQUENCE picture_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE SEQUENCE rent_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE SEQUENCE service_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
    $this->addSql('CREATE TABLE event (id VARCHAR(255) NOT NULL, rent_id VARCHAR(255) DEFAULT NULL, name VARCHAR(100) NOT NULL, people_limit INT NOT NULL, description TEXT DEFAULT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE UNIQUE INDEX UNIQ_3BAE0AA7E5FD6250 ON event (rent_id)');
    $this->addSql('CREATE TABLE event_user (id VARCHAR(255) NOT NULL, owner_id VARCHAR(255) DEFAULT NULL, event_id VARCHAR(255) DEFAULT NULL, is_owner BOOLEAN NOT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE INDEX IDX_92589AE27E3C61F9 ON event_user (owner_id)');
    $this->addSql('CREATE INDEX IDX_92589AE271F7E88B ON event_user (event_id)');
    $this->addSql('CREATE TABLE home (id VARCHAR(255) NOT NULL, owner_id VARCHAR(255) DEFAULT NULL, name VARCHAR(100) NOT NULL, description TEXT DEFAULT NULL, address VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, active BOOLEAN NOT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE INDEX IDX_71D60CD07E3C61F9 ON home (owner_id)');
    $this->addSql('CREATE TABLE option (id VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE TABLE option_home (option_id VARCHAR(255) NOT NULL, home_id VARCHAR(255) NOT NULL, PRIMARY KEY(option_id, home_id))');
    $this->addSql('CREATE INDEX IDX_99D8A633A7C41D6F ON option_home (option_id)');
    $this->addSql('CREATE INDEX IDX_99D8A63328CDC89C ON option_home (home_id)');
    $this->addSql('CREATE TABLE picture (id VARCHAR(255) NOT NULL, home_id VARCHAR(255) DEFAULT NULL, image TEXT NOT NULL, is_main_picture BOOLEAN NOT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE INDEX IDX_16DB4F8928CDC89C ON picture (home_id)');
    $this->addSql('CREATE TABLE rent (id VARCHAR(255) NOT NULL, home_id VARCHAR(255) DEFAULT NULL, owner_id VARCHAR(255) DEFAULT NULL, start_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, total_price DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE INDEX IDX_2784DCC28CDC89C ON rent (home_id)');
    $this->addSql('CREATE INDEX IDX_2784DCC7E3C61F9 ON rent (owner_id)');
    $this->addSql('CREATE TABLE service (id VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL, price DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE TABLE service_rent (service_id VARCHAR(255) NOT NULL, rent_id VARCHAR(255) NOT NULL, PRIMARY KEY(service_id, rent_id))');
    $this->addSql('CREATE INDEX IDX_CC3BF920ED5CA9E6 ON service_rent (service_id)');
    $this->addSql('CREATE INDEX IDX_CC3BF920E5FD6250 ON service_rent (rent_id)');
    $this->addSql('CREATE TABLE "user" (id VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, firstname VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, phone VARCHAR(15) NOT NULL, company VARCHAR(255) DEFAULT NULL, token VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
    $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
    $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7E5FD6250 FOREIGN KEY (rent_id) REFERENCES rent (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE event_user ADD CONSTRAINT FK_92589AE27E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE event_user ADD CONSTRAINT FK_92589AE271F7E88B FOREIGN KEY (event_id) REFERENCES event (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE home ADD CONSTRAINT FK_71D60CD07E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE option_home ADD CONSTRAINT FK_99D8A633A7C41D6F FOREIGN KEY (option_id) REFERENCES option (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE option_home ADD CONSTRAINT FK_99D8A63328CDC89C FOREIGN KEY (home_id) REFERENCES home (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE picture ADD CONSTRAINT FK_16DB4F8928CDC89C FOREIGN KEY (home_id) REFERENCES home (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC28CDC89C FOREIGN KEY (home_id) REFERENCES home (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE service_rent ADD CONSTRAINT FK_CC3BF920ED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('ALTER TABLE service_rent ADD CONSTRAINT FK_CC3BF920E5FD6250 FOREIGN KEY (rent_id) REFERENCES rent (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    $this->addSql('CREATE EXTENSION IF NOT EXISTS unaccent');
    $this->addSql('DROP TEXT SEARCH CONFIGURATION IF EXISTS mydict');
    $this->addSql('CREATE TEXT SEARCH CONFIGURATION mydict ( COPY = simple )');
    $this->addSql('ALTER TEXT SEARCH CONFIGURATION mydict ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple');

    $admin = '$argon2id$v=19$m=65536,t=4,p=1$CX+1D6E9oCTGz6GId18+sQ$KpGqGrzznHuOMEUwSakpalPg+lTdljBYMrDc3naGFOc';

    $this->addSql("INSERT INTO public.user(id, email, password, lastname, firstname, roles, phone, created_at, updated_at)
                VALUES (nextval('user_id_seq'),
                        'admin@avg.com',
                        '".$admin."',
                        'Admin lastname',
                        'Admin firstname',
                        '[\"ROLE_ADMIN\"]',
                        '0123456789',
                        '2020-11-06 09:01:22',
                        '2020-11-06 09:01:22')");
  }

  public function down(Schema $schema): void
  {
    // this down() migration is auto-generated, please modify it to your needs
    $this->addSql('ALTER TABLE event_user DROP CONSTRAINT FK_92589AE271F7E88B');
    $this->addSql('ALTER TABLE option_home DROP CONSTRAINT FK_99D8A63328CDC89C');
    $this->addSql('ALTER TABLE picture DROP CONSTRAINT FK_16DB4F8928CDC89C');
    $this->addSql('ALTER TABLE rent DROP CONSTRAINT FK_2784DCC28CDC89C');
    $this->addSql('ALTER TABLE option_home DROP CONSTRAINT FK_99D8A633A7C41D6F');
    $this->addSql('ALTER TABLE event DROP CONSTRAINT FK_3BAE0AA7E5FD6250');
    $this->addSql('ALTER TABLE service_rent DROP CONSTRAINT FK_CC3BF920E5FD6250');
    $this->addSql('ALTER TABLE service_rent DROP CONSTRAINT FK_CC3BF920ED5CA9E6');
    $this->addSql('ALTER TABLE event_user DROP CONSTRAINT FK_92589AE27E3C61F9');
    $this->addSql('ALTER TABLE home DROP CONSTRAINT FK_71D60CD07E3C61F9');
    $this->addSql('ALTER TABLE rent DROP CONSTRAINT FK_2784DCC7E3C61F9');
    $this->addSql('DROP SEQUENCE event_id_seq CASCADE');
    $this->addSql('DROP SEQUENCE event_user_id_seq CASCADE');
    $this->addSql('DROP SEQUENCE home_id_seq CASCADE');
    $this->addSql('DROP SEQUENCE option_id_seq CASCADE');
    $this->addSql('DROP SEQUENCE picture_id_seq CASCADE');
    $this->addSql('DROP SEQUENCE rent_id_seq CASCADE');
    $this->addSql('DROP SEQUENCE service_id_seq CASCADE');
    $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
    $this->addSql('DROP TABLE event');
    $this->addSql('DROP TABLE event_user');
    $this->addSql('DROP TABLE home');
    $this->addSql('DROP TABLE option');
    $this->addSql('DROP TABLE option_home');
    $this->addSql('DROP TABLE picture');
    $this->addSql('DROP TABLE rent');
    $this->addSql('DROP TABLE service');
    $this->addSql('DROP TABLE service_rent');
    $this->addSql('DROP TABLE "user"');

    $this->addSql('DROP TEXT SEARCH CONFIGURATION mydict');
    $this->addSql('DROP EXTENSION unaccent');
  }
}
