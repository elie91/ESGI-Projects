# Commandes

* install local dependencies: `python3 -m pip install -r requirements.txt `
* create migrations: `docker-compose exec web python manage.py makemigrations web`
* show migrations: `docker-compose exec web python manage.py sqlmigrate web {migrationID}`
* run migrations: `docker-compose exec web python manage.py migrate`
* create superuser: `docker-compose exec web python manage.py createsuperuser`
* run fixture: `docker-compose exec web python manage.py loaddata fixtures`
* truncate database `docker-compose exec web python manage.py flush`