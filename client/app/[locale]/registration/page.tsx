import { RegistrationFlow } from "@ory/client";

import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { AxiosError } from "axios";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: `${APP_NAME} Registration`,
  description: `Let's get started with ${APP_NAME}!`,
};

async function getRegistrationFlow(flowId: string): Promise<RegistrationFlow> {
  const cookie = headers().get("cookie") || "";

  try {
    const { data } = await ory.getRegistrationFlow({
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
    <div className="w-full h-full max-w-md mx-auto flex items-center">
      <RegisterForm flow={flow} />
    </div>
  );
}