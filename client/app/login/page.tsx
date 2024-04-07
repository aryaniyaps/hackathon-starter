import { LoginFlow } from "@ory/client";

import { APP_NAME } from "@/lib/constants";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { AxiosError } from "axios";
import { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: `Sign In to ${APP_NAME}`,
  description: `Welcome back to ${APP_NAME}`,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let flow: LoginFlow | null = null;

  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = searchParams["refresh"];

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = searchParams["all"];

  try {
    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      const { data } = await ory.getLoginFlow({ id: String(flowId) });
      flow = data;
    } else {
      // Otherwise we initialize it
      const { data } = await ory.createBrowserLoginFlow({
        refresh: Boolean(refresh),
        aal: aal ? String(aal) : undefined,
        returnTo: returnTo ? String(returnTo) : undefined,
      });
      flow = data;
    }
  } catch (err) {
    if (err instanceof AxiosError) handleFlowError(err, "login");
  }

  if (!flow) {
    return;
  }

  return (
    <div className="w-full h-full max-w-md mx-auto flex items-center">
      <LoginForm flow={flow} />
    </div>
  );
}
