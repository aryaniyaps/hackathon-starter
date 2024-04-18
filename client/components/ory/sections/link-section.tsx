import { UiNode } from "@ory/kratos-client";
import { JSX } from "react";

import { FilterFlowNodes } from "../helpers/filter-flow-nodes";

export interface LinkSectionProps {
  nodes: UiNode[];
}

/**
 * LinkSection renders the fields for recovery and verification
 * Please see the Ory docs for more information:
 * - https://www.ory.sh/docs/kratos/self-service/flows/account-recovery-password-reset
 * - https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation
 */
export const LinkSection = ({ nodes }: LinkSectionProps): JSX.Element => (
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-6">
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["link", "code"],
          excludeAttributes: "submit",
        }}
      />
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: ["link", "code"],
        attributes: "submit",
      }}
    />
  </div>
);
