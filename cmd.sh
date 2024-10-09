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
