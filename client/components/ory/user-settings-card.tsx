"use client";
import { SettingsFlow } from "@ory/kratos-client";
import { JSX } from "react";

import { useTranslations } from "next-intl";
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
} & UserAuthFormAdditionalProps;

export const UserSettingsCard = ({
  flow,
  method,
  title,
  includeScripts,
  onSubmit,
  className,
}: UserSettingsCardProps): JSX.Element | null => {
  const t = useTranslations("settings.account");

  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes });
  }

  let $flow: JSX.Element | null = null;
  let cardTitle = "";

  switch (method) {
    case "profile":
      cardTitle = title ?? t("title-profile");
      $flow = <ProfileSettingsSection flow={flow} />;
      break;
    case "password":
      if (hasPassword(flow.ui.nodes)) {
        cardTitle = title ?? t("title-password");
        $flow = <PasswordSettingsSection flow={flow} />;
      }
      break;
    case "webauthn":
      if (hasWebauthn(flow.ui.nodes)) {
        cardTitle = title ?? t("title-webauthn");
        $flow = <WebAuthnSettingsSection flow={flow} />;
      }
      break;
    case "passkey":
      if (hasPasskey(flow.ui.nodes)) {
        cardTitle = title ?? t("title-passkey");
        $flow = <PasskeySettingsSection flow={flow} />;
      }
      break;
    case "lookup_secret":
      if (hasLookupSecret(flow.ui.nodes)) {
        cardTitle = title ?? t("title-lookup-secret");
        $flow = <LookupSecretSettingsSection flow={flow} />;
      }
      break;
    case "oidc":
      if (hasOidc(flow.ui.nodes)) {
        cardTitle = title ?? t("title-oidc");
        $flow = <OIDCSettingsSection flow={flow} />;
      }
      break;
    case "totp":
      if (hasTotp(flow.ui.nodes)) {
        cardTitle = title ?? t("title-totp");
        $flow = <TOTPSettingsSection flow={flow} />;
      }
      break;
    default:
      $flow = null;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {cardTitle && <h3 className="text-lg font-medium">{cardTitle}</h3>}
      <UserAuthForm
        flow={flow}
        onSubmit={onSubmit}
        className={className}
        data-testid={`${method}-settings-card`}
      >
        {$flow}
      </UserAuthForm>
    </div>
  );
};
