"use client";
import { NodeMessages } from "@/components/ory/helpers/node-messages";
import { hasFlowType } from "@/components/ory/helpers/utils";
import {
  UserSettingsCard,
  UserSettingsFlowType,
} from "@/components/ory/user-settings-card";
import { Separator } from "@/components/ui/separator";
import { handleClientSideFlowError } from "@/lib/errors";
import { kratos } from "@/lib/kratos";
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/kratos-client";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function AccountSettingsScreen() {
  const [flow, setFlow] = useState<SettingsFlow>();

  // Get ?flow=... from the URL
  const router = useRouter();
  const searchParams = useSearchParams();
  const flowId = searchParams.get("flow");
  const returnTo = searchParams.get("return_to") || "";

  useEffect(() => {
    // If we already have a flow, do nothing.
    if (flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      kratos
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleClientSideFlowError(router, "settings", setFlow));
      return;
    }

    // Otherwise we initialize it
    kratos
      .createBrowserSettingsFlow({
        returnTo: String(returnTo),
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleClientSideFlowError(router, "settings", setFlow));
  }, [flowId, router, returnTo, flow]);

  function onSubmit(values: UpdateSettingsFlowBody) {
    // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    // his data when she/he reloads the page.
    router.push(`/settings?flow=${flow?.id}`, { scroll: false });
    kratos
      .updateSettingsFlow({
        flow: String(flow?.id),
        updateSettingsFlowBody: values,
      })
      .then(({ data }) => {
        // The settings have been saved and the flow was updated. Let's show it to the user!
        setFlow(data);

        // continue_with is a list of actions that the user might need to take before the settings update is complete.
        // It could, for example, contain a link to the verification form.
        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_verification_ui":
                router.push(`/verification?flow=${item.flow.id}`);
                return;
            }
          }
        }

        if (data.return_to) {
          window.location.href = data.return_to;
          return;
        }
      })
      .catch(handleClientSideFlowError(router, "settings", setFlow))
      .catch(async (err: AxiosError) => {
        const data = err.response?.data as any;
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(data);
          return;
        }

        return Promise.reject(err);
      });
  }

  // TODO: return loading state here
  if (!flow) return null;

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
              onSubmit={({ body }) => onSubmit(body as UpdateSettingsFlowBody)}
            />
            {index < enabledFlows.length - 1 && <Separator />}{" "}
            {/* Render separator if not the last flow */}
          </Fragment>
        );
      })}
    </div>
  );
}
