#!/usr/bin/env bash

function main {

    case $1 in

    "test")
        docker compose build
        docker compose up
        ;;

    "init")
        npm ci
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
        echo "copying database to binary file"
        psql -U postgres -d subtubes -p 5432 -h postgres -c "\COPY (SELECT * FROM events) TO './tmp/events.binary' WITH (FORMAT binary)"
        ;;

    "restore")
        export PGPASSWORD=postgres
        export PGOPTiONS='--statement-timeout=0'
        echo "Restoring from file ..."
        psql -U postgres -d subtubes -p 5432 -h postgres -c "\COPY events_partition FROM './tmp/events.binary' WITH (FORMAT binary)"
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
