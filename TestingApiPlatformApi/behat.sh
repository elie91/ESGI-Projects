#!/bin/sh
set -e
export APP_ENV=test

DEBUG=""
while getopts "hv" option; do
    case "${option}" in
        v)
            DEBUG="-vvv"
            ;;
        *)
            echo "Usage: `basename $0` [-vh] [feature]"
            echo "  -v verbose"
            echo "  -h help"
            exit 0
            ;;
    esac
    shift $((OPTIND-1))
done

php bin/console doctrine:database:drop --force --if-exists $DEBUG
php bin/console doctrine:database:create $DEBUG
php bin/console doctrine:migrations:migrate --no-interaction $DEBUG

FEATURE=""
if [ -n "$1" ]; then
  FEATURE="--name=\"${1}\""
fi

sh -c "php -d memory_limit=-1 vendor/bin/behat $FEATURE $DEBUG"

php bin/console doctrine:database:drop --force --if-exists $DEBUG
