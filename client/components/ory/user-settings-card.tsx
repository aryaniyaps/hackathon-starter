"use client";
import { SettingsFlow } from "@ory/client-fetch";
import { JSX } from "react";

import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { useScriptNodes } from "./helpers/node-script";
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "./helpers/user-auth-form";
import {
  hasLookupSecret,
  hasOidc,
  hasPasskey,
  hasPassword,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils";
import { LookupSecretSettingsSection } from "./sections/lookup-secret-settings-section";
import { OIDCSettingsSection } from "./sections/oidc-settings-section";
import { PasskeySettingsSection } from "./sections/passkey-settings-section";
import { PasswordSettingsSection } from "./sections/password-settings-section";
import { ProfileSettingsSection } from "./sections/profile-section";
import { TOTPSettingsSection } from "./sections/totp-settings-section";
import { WebAuthnSettingsSection } from "./sections/webauthn-settings-section";

export type UserSettingsFlowType =
  | "profile"
  | "password"
  | "totp"
  | "webauthn"
  | "passkey"
  | "oidc"
  | "lookup_secret";

export type UserSettingsCardProps = {
  flow: SettingsFlow;
  method: UserSettingsFlowType;
  title?: string;
  includeScripts?: boolean;
  className?: string;
  dividerClassName?: string;
} & UserAuthFormAdditionalProps;

export const UserSettingsCard = ({
  flow,
  method,
  title,
  includeScripts,
  onSubmit,
  className,
  dividerClassName,
}: UserSettingsCardProps): JSX.Element | null => {
  const t = useTranslations("settings.account");

  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes });
  }

  let hasFlow = false;
  let $flow: JSX.Element | null = null;
  let cardTitle = "";

  switch (method) {
    case "profile":
      hasFlow = true;
      cardTitle = title ?? t("title-profile");
      $flow = <ProfileSettingsSection flow={flow} />;
      break;
    case "password":
      if (hasPassword(flow.ui.nodes)) {
        hasFlow = true;
        cardTitle = title ?? t("title-password");
        $flow = <PasswordSettingsSection flow={flow} />;
      }
      break;
    case "webauthn":
      if (hasWebauthn(flow.ui.nodes)) {
        hasFlow = true;
        cardTitle = title ?? t("title-webauthn");
        $flow = <WebAuthnSettingsSection flow={flow} />;
      }
      break;
    case "passkey":
      if (hasPasskey(flow.ui.nodes)) {
        hasFlow = true;
        cardTitle = title ?? t("title-passkey");
        $flow = <PasskeySettingsSection flow={flow} />;
      }
      break;
    case "lookup_secret":
      if (hasLookupSecret(flow.ui.nodes)) {
        hasFlow = true;
        cardTitle = title ?? t("title-lookup-secret");
        $flow = <LookupSecretSettingsSection flow={flow} />;
      }
      break;
    case "oidc":
      if (hasOidc(flow.ui.nodes)) {
        hasFlow = true;
        cardTitle = title ?? t("title-oidc");
        $flow = <OIDCSettingsSection flow={flow} />;
      }
      break;
    case "totp":
      if (hasTotp(flow.ui.nodes)) {
        hasFlow = true;
        cardTitle = title ?? t("title-totp");
        $flow = <TOTPSettingsSection flow={flow} />;
      }
      break;
    default:
      $flow = null;
  }

  return hasFlow ? (
    <>
      <div className="flex flex-col gap-8 w-5/6">
        {cardTitle && <h3 className="text-lg font-semibold">{cardTitle}</h3>}
        <UserAuthForm
          flow={flow}
          onSubmit={onSubmit}
          className={className}
          data-testid={`${method}-settings-card`}
        >
          {$flow}
        </UserAuthForm>
      </div>
      <Separator className={dividerClassName} />
    </>
  ) : null;
};
