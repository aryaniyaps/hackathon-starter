"use client";
import { filterNodesByGroups } from "@ory/integrations/ui";
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  VerificationFlow,
} from "@ory/kratos-client";
import { JSX } from "react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/utils/style";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { MessageSection, MessageSectionProps } from "./helpers/common";
import { FilterFlowNodes } from "./helpers/filter-flow-nodes";
import { NodeMessages } from "./helpers/node-messages";
import { useScriptNodes } from "./helpers/node-script";
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "./helpers/user-auth-form";
import {
  hasHiddenIdentifier,
  hasLookupSecret,
  hasPasskey,
  hasPassword,
  hasProfile,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils";
import { AuthCodeSection } from "./sections/auth-code-section";
import { LinkSection } from "./sections/link-section";
import { LoggedInInfo } from "./sections/logged-info";
import { LoginSection } from "./sections/login-section";
import { OIDCSection } from "./sections/oidc-section";
import {
  PasskeyLoginSection,
  PasskeySection,
  PasswordlessLoginSection,
  PasswordlessSection,
} from "./sections/passwordless-section";
import { ProfileRegistrationSection } from "./sections/profile-section";
import { RegistrationSection } from "./sections/registration-section";

export interface LoginSectionAdditionalProps {
  recoveryURL?: string;
  signupURL?: string;
  logoutURL?: string;
}

export interface RegistrationSectionAdditionalProps {
  loginURL?: string;
}

export interface VerificationSectionAdditionalProps {
  signupURL?: string;
}

export interface RecoverySectionAdditionalProps {
  loginURL?: string;
}

/**
 * UserAuthCardProps used by the UserAuthCard
 * @param title - title of the user auth card
 * @param subtitle - subtitle of the user auth card, usually used to display additional information
 * @param includeScripts - include webauthn scripts in the card (optional)
 * @param className - className to pass to the card component
 * @param additionalProps - additional props to pass to the form (optional)
 */
export type UserAuthCardProps = {
  title?: string;
  subtitle?: string;
  includeScripts?: boolean;
  className?: string;
} & UserAuthFormAdditionalProps &
  (
    | {
        flow: LoginFlow;
        flowType: "login";
        additionalProps?: LoginSectionAdditionalProps;
      }
    | {
        flow: RegistrationFlow;
        flowType: "registration";
        additionalProps?: RegistrationSectionAdditionalProps;
      }
    | {
        flow: RecoveryFlow;
        flowType: "recovery";
        additionalProps?: RecoverySectionAdditionalProps;
      }
    | {
        flow: VerificationFlow;
        flowType: "verification";
        additionalProps?: VerificationSectionAdditionalProps;
      }
  );

/**
 * UserAuthCard renders a login, registration, verification or recovery flow
 * it can also handle multi factor authentication on login flows
 * @param UserAuthCardProps - a card that renders a login, registration, verification or recovery flow
 * @returns JSX.Element
 */
export const UserAuthCard = ({
  flow,
  title,
  subtitle,
  flowType,
  additionalProps,
  onSubmit,
  includeScripts,
  className,
}: UserAuthCardProps): JSX.Element => {
  const t = useTranslations();

  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes });
  }

  if (!title) {
    switch (flowType) {
      case "login":
        if (flow.refresh) {
          title = t("login.title-refresh");
        } else if (flow.requested_aal === "aal2") {
          title = t("login.title-aal2");
        } else {
          title = t("login.title", { appName: APP_NAME });
        }
        break;
      case "registration":
        title = t("registration.title");
        break;
      case "recovery":
        title = t("recovery.title");
        break;
      case "verification":
        title = t("verification.title");
        break;
    }
  }
  if (!subtitle) {
    switch (flowType) {
      case "login":
        if (flow.oauth2_login_request) {
          subtitle = t("login.subtitle-oauth2", {
            clientName:
              flow.oauth2_login_request.client?.client_name ??
              flow.oauth2_login_request.client?.client_uri,
          });
        }
        break;
      case "registration":
        if (flow.oauth2_login_request) {
          subtitle = t("registration.subtitle-oauth2", {
            clientName:
              flow.oauth2_login_request.client?.client_name ??
              flow.oauth2_login_request.client?.client_uri,
          });
        }
        break;
    }
  }

  let $flow: JSX.Element | null = null;
  let $oidc: JSX.Element | null = null;
  let $code: JSX.Element | null = null;
  let $passwordlessWebauthn: JSX.Element | null = null;
  let $passkey: JSX.Element | null = null;
  let $profile: JSX.Element | null = null;
  let message: MessageSectionProps | null = null;

  // the user might need to logout on the second factor page.
  const isLoggedIn = (flow: LoginFlow): boolean => {
    if (flow.requested_aal === "aal2") {
      return true;
    } else if (flow.refresh) {
      return true;
    }
    return false;
  };

  // passwordless can be shown if the user is not logged in (e.g. exclude 2FA screen) or if the flow is a registration flow.
  // we want the login section to handle passwordless as well when we have a 2FA screen.
  const canShowPasswordless = () =>
    !!$passwordlessWebauthn &&
    (!isLoggedIn(flow as LoginFlow) || flowType === "registration");

  // passkey can be shown if the user is not logged in (e.g. exclude 2FA screen) or if the flow is a registration flow.
  // we want the login section to handle passwordless as well when we have a 2FA screen.
  const canShowPasskey = () =>
    !!$passkey &&
    (!isLoggedIn(flow as LoginFlow) || flowType === "registration");

  const canShowProfile = () => !!$profile && flowType === "registration";

  // the current flow is a two factor flow if the user is logged in and has any of the second factor methods enabled.
  const isTwoFactor = () =>
    flowType === "login" &&
    isLoggedIn(flow) &&
    (hasTotp(flow.ui.nodes) ||
      hasWebauthn(flow.ui.nodes) ||
      hasPasskey(flow.ui.nodes) ||
      hasLookupSecret(flow.ui.nodes));

  // we check if nodes have hidden identifier, so we can display "you're looged in as" information
  const showLoggedAccount = hasHiddenIdentifier(flow.ui.nodes);

  // This function will map all the 2fa flows with their own respective forms.
  // It also helps with spacing them and adding visual dividers between each flow *if* there are more than one flow.
  //
  // Code smell: This is not really only two factor flows, but more generic refresh / forced / re-authentication flows.
  const twoFactorFlows = () =>
    isTwoFactor() &&
    [
      hasWebauthn(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="webauthn-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "webauthn",
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
      hasPasskey(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="passkey-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ["passkey"],
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
      hasPassword(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="password-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "password",
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
      hasProfile(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="profile-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "profile",
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
      hasTotp(flow.ui.nodes) && (
        <UserAuthForm
          flow={flow}
          data-testid="totp-flow"
          onSubmit={onSubmit}
          submitOnEnter={true}
        >
          <div className="flex flex-col gap-8">
            <FilterFlowNodes
              filter={{
                nodes: flow.ui.nodes,
                groups: "totp",
                withoutDefaultGroup: true,
                excludeAttributes: "submit",
              }}
            />
            <FilterFlowNodes
              filter={{
                nodes: flow.ui.nodes,
                groups: "totp",
                withoutDefaultGroup: true,
                attributes: "submit",
              }}
            />
          </div>
        </UserAuthForm>
      ),
      hasLookupSecret(flow.ui.nodes) && (
        <UserAuthForm
          flow={flow}
          data-testid="lookup-secret-flow"
          onSubmit={onSubmit}
          submitOnEnter={true}
        >
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "lookup_secret",
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
    ]
      .filter(Boolean) // remove nulls
      .map((flow, index) => (
        <div key={index} className="w-full">
          {index > 0 ? (
            <>
              <Separator /> {flow}
            </>
          ) : (
            flow
          )}
        </div>
      )); // only map the divider if the index is greater than 0 - more than one flow

  switch (flowType) {
    case "login":
      $passwordlessWebauthn = PasswordlessLoginSection({
        nodes: flow.ui.nodes,
        ...additionalProps,
      });
      $passkey = PasskeyLoginSection(flow);
      $oidc = OIDCSection(flow);
      $code = AuthCodeSection({ nodes: flow.ui.nodes });

      $flow = LoginSection({
        nodes: flow.ui.nodes,
        ...additionalProps,
      });

      if (isLoggedIn(flow) && additionalProps?.logoutURL) {
        message = {
          text: t("login.logout-label"),
          buttonText: t("login.logout-button"),
          dataTestId: "logout-link",
          url: additionalProps.logoutURL,
          isSubmittable: true,
        };
      } else if (additionalProps?.signupURL) {
        message = {
          text: t("login.registration-label"),
          buttonText: t("login.registration-button"),
          url: additionalProps.signupURL,
          dataTestId: "signup-link",
        };
      }
      break;
    case "registration":
      $passwordlessWebauthn = PasswordlessSection(flow);
      $passkey = PasskeySection(flow);
      $profile = ProfileRegistrationSection(flow);
      $oidc = OIDCSection(flow);
      $code = AuthCodeSection({ nodes: flow.ui.nodes });
      $flow = RegistrationSection({
        nodes: flow.ui.nodes,
      });
      if (additionalProps?.loginURL) {
        message = {
          text: t("registration.login-label"),
          url: additionalProps.loginURL,
          buttonText: t("registration.login-button"),
          dataTestId: "cta-link",
        };
      }
      break;
    // both verification and recovery use the same flow.
    case "recovery":
      $flow = LinkSection({
        nodes: flow.ui.nodes,
      });
      if (additionalProps?.loginURL) {
        message = {
          text: t("recovery.login-label"),
          buttonText: t("recovery.login-button"),
          url: additionalProps.loginURL,
          dataTestId: "cta-link",
        };
      }
      break;
    case "verification":
      $flow = LinkSection({
        nodes: flow.ui.nodes,
      });
      if (isLoggedIn(flow) && additionalProps?.logoutURL) {
        message = {
          text: t("login.logout-label"),
          buttonText: t("login.logout-button"),
          dataTestId: "logout-link",
          url: additionalProps.logoutURL,
          isSubmittable: true,
        };
      } else if (additionalProps?.signupURL) {
        message = {
          text: t("verification.registration-label"),
          buttonText: t("verification.registration-button"),
          url: additionalProps.signupURL,
          dataTestId: "cta-link",
        };
      }
      break;
    default:
      $flow = null;
  }

  return (
    <Card
      className={cn("max-w-md w-full px-8 py-4", className)}
      data-testid={`${flowType}-auth-card`}
    >
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-8 items-center w-full">
        <NodeMessages isGlobal uiMessages={flow.ui.messages} gap={4} />
        {$oidc && (
          <>
            <Separator />
            <UserAuthForm flow={flow} data-testid={`${flowType}-flow-oidc`}>
              {$oidc}
            </UserAuthForm>
          </>
        )}
        {$code && (
          <>
            <Separator />
            <UserAuthForm flow={flow} data-testid={`${flowType}-flow-code`}>
              {$code}
            </UserAuthForm>
          </>
        )}
        {$flow && !isTwoFactor() && (
          <>
            <Separator />
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={`${flowType}-flow`}
            >
              {$flow}
              {showLoggedAccount && <LoggedInInfo flow={flow} />}
            </UserAuthForm>
          </>
        )}
        {isTwoFactor() && (
          <>
            <NodeMessages
              gap={4}
              nodes={filterNodesByGroups({
                nodes: flow.ui.nodes,
                groups: [
                  "password",
                  "webauthn",
                  "passkey",
                  "totp",
                  "lookup_secret",
                ],
              })}
            />
            {twoFactorFlows()}
            {showLoggedAccount && <LoggedInInfo flow={flow} />}
          </>
        )}

        {canShowPasskey() && (
          <>
            <Separator />
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={"passkey-flow"}
              formFilterOverride={{
                nodes: flow.ui.nodes,
                groups: ["default", "passkey"],
                attributes: "hidden",
              }}
            >
              {$passkey}
            </UserAuthForm>
          </>
        )}

        {canShowPasswordless() && (
          <>
            <Separator />
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={"passwordless-flow"}
              formFilterOverride={{
                nodes: flow.ui.nodes,
                groups: ["default", "webauthn"],
                attributes: "hidden",
              }}
            >
              {$passwordlessWebauthn}
            </UserAuthForm>
          </>
        )}

        {$profile && (
          <>
            <Separator />
            <UserAuthForm flow={flow} data-testid={`${flowType}-flow-profile`}>
              {$profile}
            </UserAuthForm>
          </>
        )}

        {message && MessageSection(message)}
      </CardContent>
    </Card>
  );
};
