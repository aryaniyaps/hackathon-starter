import { Configuration, FrontendApi } from "@ory/client";
import { env } from "./env";

const kratos = new FrontendApi(
  new Configuration({
    basePath: env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
    baseOptions: { withCredentials: true },
  })
);

export default kratos;
