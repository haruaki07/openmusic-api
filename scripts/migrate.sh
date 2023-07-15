set -o allexport
source $PWD/.env
set +o allexport

DATABASE_URL=postgres://$PGUSER:$PGPASSWORD@$PGHOST:$PGPORT/$PGDATABASE \
    npx node-pg-migrate $@