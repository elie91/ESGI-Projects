# Symfony 5

## Features available

* Back & Front
* Multi-languages
* Users system (Login, Update, Reset password, Soft delete)

## Technologies used

* Symfony 5 (require Composer)
* Docker
* Webpack Encore
* Bootstrap 4.4 (require jQuery & Popper.js)
* Fontawesome 5
* Sass
* Yarn or NPM

## Build the project

Download the project `git clone git@gitlab.com:Po0pperS/symfony-skeleton.git Skeleton`

Move in the directory `cd Skeleton`

Install the dependencies `composer install`

Build the project with docker `docker-compose up --build`

Build the assets with yarn `yarn watch`

Your project is ready `http://localhost:7080`

:warning: You need to create `.env.local` with 
* `DATABASE_URL=postgresql://symfony:symfony@db/symfony?charset=UTF-8`

* `MAILER_DSN=smtp://noreply@thomascoichot.fr:**********@ssl0.ovh.net`

* `EMAIL=noreply@thomascoichot.fr`

* `EMAIL_TO=YOUREMAIL`


