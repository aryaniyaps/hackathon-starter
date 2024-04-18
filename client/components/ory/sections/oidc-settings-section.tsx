"use client";
import { SettingsFlow } from "@ory/kratos-client";
import { JSX } from "react";

import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasOidc } from "../helpers/utils";

export interface OIDCSettingsProps {
  flow: SettingsFlow;
  title?: string;
}

export const OIDCSettingsSection = ({
  flow,
}: OIDCSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "oidc",
    withoutDefaultGroup: true,
  };

  return hasOidc(flow.ui.nodes) ? (
    <div className="flex flex-col gap-8">
      <FilterFlowNodes
        filter={filter}
        buttonOverrideProps={{ className: "w-full" }}
      />
    </div>
  ) : null;
};
