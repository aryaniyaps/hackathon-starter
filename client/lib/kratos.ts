import { Configuration, FrontendApi } from "@ory/client-fetch";
import { env } from "./env";

const kratos = new FrontendApi(
  new Configuration({
    basePath: env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
    credentials: "include",
  })
);

export default kratos;
