import {
  Configuration as FetchConfiguration,
  FrontendApi as FetchFrontendApi,
} from "@ory/client-fetch";
import { Configuration, FrontendApi } from "@ory/kratos-client";
import { env } from "./env";

const kratos = new FrontendApi(
  new Configuration({
    basePath: env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
    baseOptions: { withCredentials: true, mode: "cors" },
  })
);

export default kratos;

export const kratosFetch = new FetchFrontendApi(
  new FetchConfiguration({
    basePath: env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
    credentials: "include",
  })
);
