import { Configuration, OAuth2Api } from "@ory/hydra-client";
import { env } from "./env";

export const hydraClient = new OAuth2Api(
  new Configuration({
    basePath: env.HYDRA_URL,
  })
);