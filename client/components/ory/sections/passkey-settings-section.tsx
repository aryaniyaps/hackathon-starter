"use client";
import { JSX } from "react";

import { SettingsFlow } from "@ory/kratos-client";
import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasPasskey } from "../helpers/utils";

export interface PasskeySettingsProps {
  flow: SettingsFlow;
}

export const PasskeySettingsSection = ({
  flow,
}: PasskeySettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "passkey",
    withoutDefaultGroup: true,
  };

  return hasPasskey(flow.ui.nodes) ? (
    <div className="flex flex-col gap-8">
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributes: "onclick,button" }}
      />

      <FilterFlowNodes
        filter={{ ...filter, attributes: "onclick,button" }}
        buttonOverrideProps={{ className: "w-full" }}
      />
    </div>
  ) : null;
};
