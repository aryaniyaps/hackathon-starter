"use client";
import { SettingsFlow } from "@ory/kratos-client";
import { JSX } from "react";

import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasLookupSecret } from "../helpers/utils";

export interface LookupSecretSettingsProps {
  flow: SettingsFlow;
}

export const LookupSecretSettingsSection = ({
  flow,
}: LookupSecretSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "lookup_secret",
    withoutDefaultGroup: true,
  };

  return hasLookupSecret(flow.ui.nodes) ? (
    <div className="flex flex-col gap-8">
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributes: "submit,button" }}
      />
      <FilterFlowNodes
        filter={{ ...filter, attributes: "submit,button" }}
        buttonOverrideProps={{ className: "w-full" }}
      />
    </div>
  ) : null;
};
