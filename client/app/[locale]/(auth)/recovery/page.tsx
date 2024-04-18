import { RecoveryFlow } from "@ory/kratos-client";

import { UserAuthCard } from "@/components/ory/user-auth-card";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { handleFlowError } from "@/lib/errors";
import kratos from "@/lib/kratos";
import { AxiosError } from "axios";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${APP_NAME} Account Recovery`,
};

async function getRecoveryFlow(flowId: string): Promise<RecoveryFlow> {
  const cookie = headers().get("cookie") || "";

  try {
    const { data } = await kratos.getRecoveryFlow({
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
    <div className="w-full max-w-md mx-auto flex items-center">
      <UserAuthCard
        // This defines what kind of card we want to render.
        flowType={"recovery"}
        // we always need the flow data which populates the form fields and error messages dynamically
        flow={flow}
        // the registration card should allow the user to go to the registration page and the login page
        additionalProps={{
          loginURL: "/login",
        }}
        // we might need webauthn support which requires additional js
        includeScripts={true}
      />
    </div>
  );
}
