#!/usr/bin/env bash

##########
#
# Run the setup of Keycloak with the environment variable values from the .env files of the docker-compose module.
#
#########

set -a

CURRENTDIR=$(dirname "$0")

source "${CURRENTDIR}"/../docker-compose/src/main/resources/keycloak.common.env
source "${CURRENTDIR}"/../docker-compose/src/main/resources/keycloak.specific.env
source "${CURRENTDIR}"/../docker-compose/src/main/resources/secrets.env


# set the working directory as in the docker image
cd "${CURRENTDIR}"/target/keycloak/
bash ./bin/keycloak-setup.sh
