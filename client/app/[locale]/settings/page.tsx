import { NodeMessages } from "@/components/ory/helpers/node-messages";
import { hasFlowType } from "@/components/ory/helpers/utils";
import {
  UserSettingsCard,
  UserSettingsFlowType,
} from "@/components/ory/user-settings-card";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { handleFlowError } from "@/lib/errors";
import kratos from "@/lib/kratos";
import { SettingsFlow } from "@ory/kratos-client";
import { AxiosError } from "axios";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";

async function getSettingsFlow(flowId: string): Promise<SettingsFlow> {
  const cookie = headers().get("cookie") || "";

  try {
    const { data } = await kratos.getSettingsFlow({
      id: String(flowId),
      cookie,
    });

    console.log("data", data)

    // continue_with is a list of actions that the user might need to take before the settings update is complete.
    // It could, for example, contain a link to the verification form.
    if (data.continue_with) {
      for (const item of data.continue_with) {
        switch (item.action) {
          case "show_verification_ui":
            redirect("/verification?flow=" + item.flow.id);
        }
      }
    }

    if (data.return_to) {
      redirect(data.return_to);
    }

    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      handleFlowError(err, "settings");
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

  const enabledFlows = (
    [
      "profile",
      "totp",
      "password",
      "webauthn",
      "passkey",
      "lookup_secret",
      "oidc",
    ] as UserSettingsFlowType[]
  ).filter((flowType) => hasFlowType(flow.ui.nodes, flowType));

  return (
    <div id="settingsForm" className="flex flex-col gap-8 w-5/6">
      {/* Show a success message if the user changed their password */}
      <NodeMessages isGlobal uiMessages={flow.ui.messages} gap={4} />
      {enabledFlows.map((flowType: UserSettingsFlowType, index) => {
        const includeScripts = flowType === "webauthn"; // Include scripts only for webauthn

        return (
          <Fragment key={flowType}>
            <UserSettingsCard
              flow={flow}
              method={flowType}
              includeScripts={includeScripts}
            />
            {index < enabledFlows.length - 1 && <Separator />}{" "}
            {/* Render separator if not the last flow */}
          </Fragment>
        );
      })}
    </div>
  );
}
