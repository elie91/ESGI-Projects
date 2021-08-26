[![Anurag's github stats](https://github-readme-stats.vercel.app/api?username=elie91)](https://github.com/anuraghazra/github-readme-stats)

## Valomat Project

## Projet annuel de 4éme année pour l'entreprise Valomat

    * Installation du projet: 
        * composer install
        * npm install
        * docker-compose build
        * docker-compose up -d
        * Pour lancer le compiler pour les assets
             npx encore dev --watch 
    * Ports
        * App: localhost:7080
        * Bdd: localhost:7082
        
    * Fixtures
        * Pour insérer les données de test, run 
            php bin/console doctrine:fixtures:load
        
    * Branches
        * Créer des branches features 
        * Se mettre sur develop
        * lancer git checkout -b "feature/mafeature"
        
    * Commandes:
        Préfixer les commandes par docker-compose exec php bin/console
        - make:entity -> créer une entité
        - make:crud -> créer un crud
        - make:controller
        - doctrine:schema:update --dump-sql 
        - doctrine:schema:update --force
        - make:migration
        - doctrine:migrations:migrate
        - cache:clear
        - doctrine:database:drop
        - doctrine:database:create
    
    * Blackfire
        - docker-compose exec php sh
        - blackfire-agent --register
        - /etc/init.d/blackfire-agent restart
    
