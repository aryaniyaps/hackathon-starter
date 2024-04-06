import { Configuration, FrontendApi } from "@ory/client";
import { edgeConfig } from "@ory/integrations/next";
import { env } from "./env";

const localConfig = {
  basePath: env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
  baseOptions: {
    withCredentials: true,
  },
};

const ory = new FrontendApi(
  new Configuration(
    env.NEXT_PUBLIC_KRATOS_PUBLIC_URL ? localConfig : edgeConfig
  )
);

export default ory;
