# AVG API

### Generate keys to JWT

- `mkdir -p config/jwt`
- `openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096`
- `openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout`

Then update JWT_PASSPHRASE in .env.local or .env

### Update Database

- `docker-compose exec php bin/console d:s:u -f --dump-sql`
or if migrations exists
- `docker-compose exec php bin/console d:m:mi`

### Generate Fixtures

- `docker-compose exec php bin/console d:f:l`

### Send mail to me

In order to retrieve all the mails sent by the API, please modify the variable OVERRIDE_EMAIL_TO
