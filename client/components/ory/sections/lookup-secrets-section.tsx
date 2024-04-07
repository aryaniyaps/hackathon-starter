import { UiNode } from "@ory/client";
import { JSX } from "react";

import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasLookupSecret } from "../helpers/utils";

export interface LookupSecretsSectionProps {
  nodes: UiNode[];
}

export const LookupSecretsSection = ({
  nodes,
}: LookupSecretsSectionProps): JSX.Element | null => {
  return hasLookupSecret(nodes) ? (
    <div className="flex flex-col gap-12">
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: "lookup_secret",
        }}
      />
    </div>
  ) : null;
};
