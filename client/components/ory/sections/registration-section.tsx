import { UiNode } from "@ory/kratos-client";
import { JSX } from "react";

import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasPassword } from "../helpers/utils";

export interface RegistrationSectionProps {
  nodes: UiNode[];
}

export const RegistrationSection = ({
  nodes,
}: RegistrationSectionProps): JSX.Element | null => {
  return hasPassword(nodes) ? (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["password"],
            excludeAttributes: "submit,hidden",
          }}
        />
      </div>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["password"],
          excludeAttributes: "hidden",
          attributes: "submit",
        }}
      />
    </div>
  ) : null;
};
