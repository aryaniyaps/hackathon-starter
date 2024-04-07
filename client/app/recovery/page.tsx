import { RecoveryFlow } from "@ory/client";

import { APP_NAME } from "@/lib/constants";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { AxiosError } from "axios";
import { Metadata } from "next";
import RecoveryForm from "./recovery-form";

export const metadata: Metadata = {
  title: `${APP_NAME} Account Recovery`,
};

export default async function RecoveryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let flow: RecoveryFlow | null = null;

  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  try {
    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      const { data } = await ory.getRecoveryFlow({ id: String(flowId) });
      flow = data;
    } else {
      // Otherwise we initialize it
      const { data } = await ory.createBrowserRecoveryFlow({
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
      <RecoveryForm flow={flow} />
    </div>
  );
}
