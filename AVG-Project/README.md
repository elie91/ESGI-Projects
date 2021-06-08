## Liens du projet

* Prisma:
    * localhost:4466/_admin
    * localhost:4000, faire npm start dans dossier prisma avant
* VueJs
    * localhost:8081
* ApiPlatform
    * http://localhost:8080/docs
    * http://localhost:8080/_profiler


## Fixs

* Si mercure exit, cela est lié à un problème de certificat. Pour fix:
    * `docker-compose exec dev-tls sh`
    * `mkcert --cert-file localhost.crt --key-file localhost.key localhost 127.0.0.1 ::1 mercure`
    * up de nouveau les containers
* Ne pas oubliez de générez les clés JWT, voir le README du dossier /api


* Erreur GraphQL pour la BDD:
    * `docker-compose down`
    * `docker-compose up php`
    * `docker-compose exec php bin/console d:d:d --force`
    * `docker-compose exec php bin/console d:d:c`
    * `docker-compose up`
    * Supprimer table et séquences de la DB
    * `prisma1 deploy`
    * RESUPPRIMER table et séquences de la DB
    * `docker-compose exec php bin/console d:m:m`
    * REFAIRE `prisma1 deploy`
    * `docker-compose exec php bin/console d:f:l`
