<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230821162938 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE freelance (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, zip_code VARCHAR(10) NOT NULL, country VARCHAR(255) NOT NULL, siren VARCHAR(9) NOT NULL, siret VARCHAR(14) NOT NULL, duns_number VARCHAR(14) NOT NULL, status VARCHAR(100) NOT NULL, updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE invoice_detail (id INT AUTO_INCREMENT NOT NULL, invoice_id INT DEFAULT NULL, description VARCHAR(255) NOT NULL, quantity INT NOT NULL, price NUMERIC(10, 2) NOT NULL, tva TINYINT(1) NOT NULL, updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_9530E2C02989F1FD (invoice_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE invoice_detail ADD CONSTRAINT FK_9530E2C02989F1FD FOREIGN KEY (invoice_id) REFERENCES invoice (id)');
        $this->addSql('ALTER TABLE user ADD freelance_id INT DEFAULT NULL, ADD updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E8DF656B FOREIGN KEY (freelance_id) REFERENCES freelance (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E8DF656B ON user (freelance_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `user` DROP FOREIGN KEY FK_8D93D649E8DF656B');
        $this->addSql('ALTER TABLE invoice_detail DROP FOREIGN KEY FK_9530E2C02989F1FD');
        $this->addSql('DROP TABLE freelance');
        $this->addSql('DROP TABLE invoice_detail');
        $this->addSql('DROP INDEX UNIQ_8D93D649E8DF656B ON `user`');
        $this->addSql('ALTER TABLE `user` DROP freelance_id, DROP updated_at, DROP created_at');
    }
}
