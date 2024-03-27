import Keycloak from "keycloak-js";
import { env } from "./env";

const keycloak = new Keycloak({
  clientId: env.KEYCLOAK_CLIENT_ID,
  realm: env.KEYCLOAK_REALM,
  url: env.KEYCLOAK_URL,
});

keycloak.init({ onLoad: "check-sso" });

export default keycloak;
