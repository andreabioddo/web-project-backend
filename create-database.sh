#!/usr/bin/env bash

# load .env
export $(grep -v '^#' .env | xargs)

sudo PGPASSWORD=$DB_USER_PASSWD psql -U $DB_USER -h 127.0.0.1 -d $DB_NAME -a -f create-database.sql
sudo PGPASSWORD=$DB_USER_PASSWD psql -U $DB_USER -h 127.0.0.1 -d $DB_NAME -a -f dummy-data.sql
