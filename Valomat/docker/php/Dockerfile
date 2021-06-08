FROM php:7.4.4-fpm

RUN apt-get update && apt-get install -y libicu-dev gnupg2 wget apt-utils

RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql

RUN curl -OLsS https://get.blackfire.io/blackfire-player.phar && chmod +x blackfire-player.phar && mv blackfire-player.phar /usr/local/bin/blackfire-player

RUN apt-get clean

RUN pecl install apcu
RUN docker-php-ext-enable apcu
RUN docker-php-ext-install intl opcache

RUN wget -q -O - https://packages.blackfire.io/gpg.key | apt-key add -
RUN echo "deb http://packages.blackfire.io/debian any main" | tee /etc/apt/sources.list.d/blackfire.list
RUN apt-get update && apt-get install -y blackfire-agent blackfire-php


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ADD php.ini /usr/local/etc/php/conf.d/php.ini

WORKDIR /usr/share/nginx/html
