import { LoginFlow } from "@ory/client";

import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { AxiosError } from "axios";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: `Sign In to ${APP_NAME}`,
  description: `Welcome back to ${APP_NAME}`,
};

async function getLoginFlow(flowId: string): Promise<LoginFlow> {
  const cookie = headers().get("cookie") || "";

  try {
    const { data } = await ory.getLoginFlow({
      id: String(flowId),
      cookie,
    });
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      handleFlowError(err, "login");
    }
    throw err;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = searchParams["refresh"];

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = searchParams["all"];

  if (!flowId) {
    const redirectUrl = new URL(
      `${env.NEXT_PUBLIC_KRATOS_PUBLIC_URL}/self-service/login/browser`
    );

    if (refresh != undefined)
      redirectUrl.searchParams.set("refresh", String(refresh));

    if (returnTo != undefined)
      redirectUrl.searchParams.set("return_to", String(returnTo));

    if (aal != undefined) redirectUrl.searchParams.set("aal", String(aal));

    redirect(redirectUrl.toString());
  }

  const flow = await getLoginFlow(String(flowId));

  return (
    <div className="w-full h-full max-w-md mx-auto flex items-center">
      <LoginForm flow={flow} />
    </div>
  );
}
