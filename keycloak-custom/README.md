Keycloak-Custom
===============

This project creates a custom [Keycloak] server based on [Keycloak.X]. It is structured as a multi-module Maven build and contains the following top-level modules:

- `config`: provides the build stage configuration and the setup of Keycloak
- `container`: creates the custom docker image
- `docker-compose`: provides a sample for launching the custom docker image
- `extensions`: provides samples for Keycloak SPI implementations
- `server`: provides a Keycloak installation for local development & testing
- `themes`: provides samples for custom themes

Please see the tutorial [Configuring Passkey](https://keycloak.ch/keycloak-tutorials/tutorial-passkey/) for the details of this project.

[Keycloak]: https://keycloak.org
[Keycloak.X]: https://www.keycloak.org/migration/migrating-to-quarkus


## Running the server

Run the following command first

```
mvn clean package
```

Run the server using the following command

```
./server/run-keycloak.sh
```

To setup the Keycloak server, run the following command in another terminal:

```
./server/run-keycloak-setup.sh
```
