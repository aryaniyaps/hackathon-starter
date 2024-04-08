import { RecoveryFlow } from "@ory/client";

import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { AxiosError } from "axios";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import RecoveryForm from "./recovery-form";

export const metadata: Metadata = {
  title: `${APP_NAME} Account Recovery`,
};

async function getRecoveryFlow(flowId: string): Promise<RecoveryFlow> {
  try {
    const { data } = await ory.getRecoveryFlow({
      id: String(flowId),
    });
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      handleFlowError(err, "login");
    }
    throw err;
  }
}

export default async function RecoveryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  if (!flowId) {
    redirect(
      `${env.NEXT_PUBLIC_KRATOS_PUBLIC_URL}/self-service/recovery/browser`
    );
  }

  const flow = await getRecoveryFlow(String(flowId));

  return (
    <div className="w-full h-full max-w-md mx-auto flex items-center">
      <RecoveryForm flow={flow} />
    </div>
  );
}
