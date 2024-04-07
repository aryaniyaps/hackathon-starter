import { RegistrationFlow } from "@ory/client";

import { APP_NAME } from "@/lib/constants";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { AxiosError } from "axios";
import { Metadata } from "next";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: `${APP_NAME} Registration`,
  description: `Let's get started with ${APP_NAME}!`,
};

export default async function RegistrationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let flow: RegistrationFlow | null = null;

  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  try {
    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      const { data } = await ory.getRegistrationFlow({ id: String(flowId) });
      flow = data;
    } else {
      // Otherwise we initialize it
      const { data } = await ory.createBrowserRegistrationFlow({
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
      <RegisterForm flow={flow} />
    </div>
  );
}
