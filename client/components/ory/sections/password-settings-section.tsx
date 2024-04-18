"use client";
import { SettingsFlow } from "@ory/kratos-client";
import { JSX } from "react";

import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasPassword } from "../helpers/utils";

export interface PasswordSettingsProps {
  flow: SettingsFlow;
}

export const PasswordSettingsSection = ({
  flow,
}: PasswordSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "password",
    withoutDefaultGroup: true,
  };
  return hasPassword(flow.ui.nodes) ? (
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
