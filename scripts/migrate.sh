set -o allexport
source $PWD/.env
set +o allexport

DATABASE_URL=postgres://$PGUSER:$PGPASS@$PGHOST:$PGPORT/$PGDB \
    npx node-pg-migrate $@