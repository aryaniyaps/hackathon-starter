import { VerificationFlow } from "@ory/client";

import { APP_NAME } from "@/lib/constants";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { AxiosError } from "axios";
import { Metadata } from "next";
import VerificationForm from "./verification-form";

export const metadata: Metadata = {
  title: `${APP_NAME} Account Verification`,
};

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let flow: VerificationFlow | null = null;

  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  try {
    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      const { data } = await ory.getVerificationFlow({ id: String(flowId) });
      flow = data;
    } else {
      // Otherwise we initialize it
      const { data } = await ory.createBrowserVerificationFlow({
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
      <VerificationForm flow={flow} />
    </div>
  );
}
