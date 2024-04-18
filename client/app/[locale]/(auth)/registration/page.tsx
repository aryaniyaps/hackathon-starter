import { RegistrationFlow } from "@ory/kratos-client";

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
  title: `${APP_NAME} Registration`,
  description: `Let's get started with ${APP_NAME}!`,
};

async function getRegistrationFlow(flowId: string): Promise<RegistrationFlow> {
  const cookie = headers().get("cookie") || "";

  try {
    const { data } = await kratos.getRegistrationFlow({
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

export default async function RegistrationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  if (!flowId) {
    const redirectUrl = new URL(
      `${env.NEXT_PUBLIC_KRATOS_PUBLIC_URL}/self-service/registration/browser`
    );

    if (returnTo != undefined)
      redirectUrl.searchParams.set("return_to", String(returnTo));

    redirect(redirectUrl.toString());
  }

  const flow = await getRegistrationFlow(String(flowId));

  return (
    <div className="w-full max-w-md mx-auto flex items-center">
      <UserAuthCard
        // This defines what kind of card we want to render.
        flowType={"registration"}
        // we always need the flow data which populates the form fields and error messages dynamically
        flow={flow}
        // the registration card needs a way to navigate to the login page
        additionalProps={{
          loginURL: "/login",
        }}
        // we might need webauthn support which requires additional js
        includeScripts={true}
      />
    </div>
  );
}
