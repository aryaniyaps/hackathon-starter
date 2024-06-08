import { VerificationFlow } from "@ory/kratos-client";

import { UserAuthCard } from "@/components/ory/user-auth-card";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { handleFlowError } from "@/lib/errors";
import { kratos } from "@/lib/kratos";
import { AxiosError } from "axios";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${APP_NAME} Account Verification`,
};

async function getVerificationFlow(flowId: string): Promise<VerificationFlow> {
  const cookie = headers().get("cookie") || "";

  try {
    const { data } = await kratos.getVerificationFlow({
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

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  if (!flowId) {
    const redirectUrl = new URL(
      `${env.NEXT_PUBLIC_KRATOS_PUBLIC_URL}/self-service/verification/browser`
    );

    if (returnTo != undefined)
      redirectUrl.searchParams.set("return_to", String(returnTo));

    redirect(redirectUrl.toString());
  }

  const flow = await getVerificationFlow(String(flowId));

  return (
    <div className="w-full max-w-md mx-auto flex items-center">
      <UserAuthCard
        // This defines what kind of card we want to render.
        flowType={"verification"}
        // we always need the flow data which populates the form fields and error messages dynamically
        flow={flow}
        // the verification card should allow the user to go to the registration page and the login page
        additionalProps={{
          signupURL: "/registration",
        }}
        // we might need webauthn support which requires additional js
        includeScripts={true}
      />
    </div>
  );
}
