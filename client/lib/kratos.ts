import { Configuration, FrontendApi } from "@ory/client";
import {
  Configuration as FetchConfiguration,
  FrontendApi as FetchFrontendApi,
} from "@ory/client-fetch";
import { env } from "./env";

const kratos = new FrontendApi(
  new Configuration({
    basePath: env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
    baseOptions: { withCredentials: true },
  })
);

export default kratos;

export const kratosFetch = new FetchFrontendApi(
  new FetchConfiguration({
    basePath: env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
    credentials: "include",
  })
);
