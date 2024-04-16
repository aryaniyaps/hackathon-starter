import { NodeMessages } from "@/components/ory/helpers/node-messages";
import {
  UserSettingsCard,
  UserSettingsFlowType,
} from "@/components/ory/user-settings-card";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { handleFlowError } from "@/lib/errors";
import kratos from "@/lib/kratos";
import { ResponseError, SettingsFlow } from "@ory/client-fetch";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getSettingsFlow(flowId: string): Promise<SettingsFlow> {
  const cookie = headers().get("cookie") || "";

  try {
    return await kratos.getSettingsFlow({
      id: String(flowId),
      cookie,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      await handleFlowError(err, "settings");
    }
    throw err;
  }
}

export const metadata: Metadata = {
  title: `Account settings | ${APP_NAME}`,
};

export default async function AccountSettingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // const t = useTranslations("settings.account");

  const returnTo = searchParams["return_to"];

  // Get ?flow=... from the URL
  const flowId = searchParams["flow"];

  if (!flowId) {
    const redirectUrl = new URL(
      `${env.NEXT_PUBLIC_KRATOS_PUBLIC_URL}/self-service/settings/browser`
    );

    if (returnTo != undefined)
      redirectUrl.searchParams.set("return_to", String(returnTo));

    redirect(redirectUrl.toString());
  }

  const flow = await getSettingsFlow(String(flowId));

  return (
    <div id="settingsForm" className="flex flex-col gap-8">
      {/* Show a success message if the user changed their password */}
      <NodeMessages global uiMessages={flow.ui.messages} gap={4} />
      {/* here we simply map all of the settings flows we could have. These flows won't render if they aren't enabled inside your Ory Network project */}
      {(
        [
          "profile",
          "password",
          "totp",
          "webauthn",
          "lookup_secret",
          "oidc",
        ] as UserSettingsFlowType[]
      ).map((flowType: UserSettingsFlowType, index) => (
        // here we render the settings flow using Ory Elements
        <UserSettingsCard
          key={index}
          // we always need to pass the component the flow since it contains the form fields, error messages and csrf token
          flow={flow}
          method={flowType}
          // include scripts for webauthn support
          includeScripts={true}
        />
      ))}
    </div>
  );
}
