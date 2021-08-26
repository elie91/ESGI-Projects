<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201213011739 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE event ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE event ALTER rent_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE event ALTER rent_id DROP DEFAULT');
        $this->addSql('ALTER TABLE event_user ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE event_user ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE event_user ALTER user_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE event_user ALTER user_id DROP DEFAULT');
        $this->addSql('ALTER TABLE event_user ALTER event_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE event_user ALTER event_id DROP DEFAULT');
        $this->addSql('ALTER TABLE home ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE home ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE home ALTER owner_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE home ALTER owner_id DROP DEFAULT');
        $this->addSql('ALTER TABLE option ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE option ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE option_home ALTER option_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE option_home ALTER option_id DROP DEFAULT');
        $this->addSql('ALTER TABLE option_home ALTER home_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE option_home ALTER home_id DROP DEFAULT');
        $this->addSql('ALTER TABLE picture ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE picture ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE picture ALTER home_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE picture ALTER home_id DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE rent ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER home_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE rent ALTER home_id DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER owner_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE rent ALTER owner_id DROP DEFAULT');
        $this->addSql('ALTER TABLE service ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE service ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE service_rent ALTER service_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE service_rent ALTER service_id DROP DEFAULT');
        $this->addSql('ALTER TABLE service_rent ALTER rent_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE service_rent ALTER rent_id DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ALTER id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "user" ALTER id DROP DEFAULT');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('ALTER TABLE home ALTER id TYPE INT');
        $this->addSql('ALTER TABLE home ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE home ALTER owner_id TYPE INT');
        $this->addSql('ALTER TABLE home ALTER owner_id DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ALTER id TYPE INT');
        $this->addSql('ALTER TABLE "user" ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE event_user ALTER id TYPE INT');
        $this->addSql('ALTER TABLE event_user ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE event_user ALTER user_id TYPE INT');
        $this->addSql('ALTER TABLE event_user ALTER user_id DROP DEFAULT');
        $this->addSql('ALTER TABLE event_user ALTER event_id TYPE INT');
        $this->addSql('ALTER TABLE event_user ALTER event_id DROP DEFAULT');
        $this->addSql('ALTER TABLE event ALTER id TYPE INT');
        $this->addSql('ALTER TABLE event ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE event ALTER rent_id TYPE INT');
        $this->addSql('ALTER TABLE event ALTER rent_id DROP DEFAULT');
        $this->addSql('ALTER TABLE option ALTER id TYPE INT');
        $this->addSql('ALTER TABLE option ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE option_home ALTER option_id TYPE INT');
        $this->addSql('ALTER TABLE option_home ALTER option_id DROP DEFAULT');
        $this->addSql('ALTER TABLE option_home ALTER home_id TYPE INT');
        $this->addSql('ALTER TABLE option_home ALTER home_id DROP DEFAULT');
        $this->addSql('ALTER TABLE service ALTER id TYPE INT');
        $this->addSql('ALTER TABLE service ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE service_rent ALTER service_id TYPE INT');
        $this->addSql('ALTER TABLE service_rent ALTER service_id DROP DEFAULT');
        $this->addSql('ALTER TABLE service_rent ALTER rent_id TYPE INT');
        $this->addSql('ALTER TABLE service_rent ALTER rent_id DROP DEFAULT');
        $this->addSql('ALTER TABLE picture ALTER id TYPE INT');
        $this->addSql('ALTER TABLE picture ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE picture ALTER home_id TYPE INT');
        $this->addSql('ALTER TABLE picture ALTER home_id DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER id TYPE INT');
        $this->addSql('ALTER TABLE rent ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER home_id TYPE INT');
        $this->addSql('ALTER TABLE rent ALTER home_id DROP DEFAULT');
        $this->addSql('ALTER TABLE rent ALTER owner_id TYPE INT');
        $this->addSql('ALTER TABLE rent ALTER owner_id DROP DEFAULT');
    }
}
