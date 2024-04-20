import { JSX } from "react";

import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { SelfServiceFlow } from "../helpers/types";
import { hasPasskey, hasWebauthn } from "../helpers/utils";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { UiNode } from "@ory/kratos-client";

export const PasswordlessSection = (
  flow: SelfServiceFlow
): JSX.Element | null => {
  return hasWebauthn(flow.ui.nodes) ? (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            // we will also map default fields here but not oidc and password fields
            groups: ["webauthn"],
            withoutDefaultAttributes: true,
            excludeAttributes: ["hidden", "button", "submit"], // the form will take care of hidden fields
          }}
        />
      </div>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["webauthn"],
          withoutDefaultAttributes: true,
          attributes: ["button", "submit"],
        }}
      />
    </div>
  ) : null;
};

export const PasskeySection = (flow: SelfServiceFlow): JSX.Element | null => {
  return hasPasskey(flow.ui.nodes) ? (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            // we will also map default fields here but not oidc and password fields
            groups: ["passkey"],
            withoutDefaultAttributes: true,
            excludeAttributes: ["hidden", "button", "submit"], // the form will take care of hidden fields
          }}
        />
      </div>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["passkey"],
          withoutDefaultAttributes: true,
          attributes: ["button", "submit"],
        }}
      />
    </div>
  ) : null;
};

export const PasskeyLoginSection = (
  flow: SelfServiceFlow
): JSX.Element | null => {
  return hasPasskey(flow.ui.nodes) ? (
    <div className="flex flex-col gap-8">
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["passkey"],
          withoutDefaultAttributes: true,
          attributes: ["button", "submit"],
        }}
      />
    </div>
  ) : null;
};

export interface PasswordlessLoginSectionProps {
  nodes: UiNode[];
  recoveryURL?: string;
}

export const PasswordlessLoginSection = ({
  nodes,
  recoveryURL,
}: PasswordlessLoginSectionProps): JSX.Element | null => {
  const t = useTranslations();
  if (hasWebauthn(nodes)) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <FilterFlowNodes
            filter={{
              nodes: nodes,
              // we will also map default fields here but not oidc and password fields
              groups: ["webauthn"],
              withoutDefaultAttributes: true,
              excludeAttributes: ["hidden", "button", "submit"], // the form will take care of hidden fields
            }}
          />
        </div>
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["webauthn"],
            withoutDefaultAttributes: true,
            attributes: ["button", "submit"],
          }}
        />
        <Link href={recoveryURL} className="w-full flex justify-center">
          <Button data-testid="forgot-password-link" variant="link">
            {t("login.recover-account")}
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};
