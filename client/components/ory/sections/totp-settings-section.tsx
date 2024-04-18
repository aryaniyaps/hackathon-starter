"use client";
import { JSX } from "react";

import { SettingsFlow } from "@ory/kratos-client";
import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasTotp } from "../helpers/utils";

export interface TOTPSettingsProps {
  flow: SettingsFlow;
}

export const TOTPSettingsSection = ({
  flow,
}: TOTPSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "totp",
    withoutDefaultGroup: true,
  };

  return hasTotp(flow.ui.nodes) ? (
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
