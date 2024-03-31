#!/usr/bin/env bash

##########
#
# Start Keycloak with the environment variables defined by the 3 .env files.
#
#########

set -a

CURRENTDIR=$(dirname "$0")

source "${CURRENTDIR}"/../docker-compose/src/main/resources/keycloak.common.env
source "${CURRENTDIR}"/../docker-compose/src/main/resources/keycloak.specific.env
source "${CURRENTDIR}"/../docker-compose/src/main/resources/secrets.env

# set the working directory as in the docker image
cd "${CURRENTDIR}"/target/keycloak/
bash ./bin/kc.sh --debug start-dev
