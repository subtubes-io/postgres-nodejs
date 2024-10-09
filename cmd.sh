#!/usr/bin/env bash

function wait_for_db() {
    echo "Waiting for the database to be ready..."
    until docker exec subtubes-postgres pg_isready -U your_db_user >/dev/null 2>&1; do
        sleep 1
        echo "Still waiting for the database..."
    done
    echo "Database is ready!"
}

function main {

    case $1 in

    "init")
        npm ci
        docker compose up -d
        wait_for_db
        npm run generate
        npm run migrate
        npm run data:1
        ;;

    "copy")
        export PGPASSWORD=postgres
        export PGOPTiONS='--statement-timeout=0'
        if [ -f ./tmp/events.binary ]; then
            echo "Deleting old file ..."
            rm ./tmp/events.binary
        fi

        psql -U postgres -d subtubes -p 5432 -h localhost -c "\COPY (SELECT * FROM events) TO './tmp/events.binary' WITH (FORMAT binary)"
        ;;

    "restore")
        export PGPASSWORD=postgres
        export PGOPTiONS='--statement-timeout=0'
        echo "Restoring from file ..."
        psql -U postgres -d subtubes -p 5432 -h localhost -c "\COPY events_partition FROM './tmp/events.binary' WITH (FORMAT binary)"
        ;;
    "destroy")
        rm -r node_modules
        docker compose stop
        docker rm subtubes-postgres
        rm -r ~/docker/postgres/subtubes-postgres
        ;;
    *)
        echo "Unrecognized command $1"
        ;;
    esac
}

main "$@"
