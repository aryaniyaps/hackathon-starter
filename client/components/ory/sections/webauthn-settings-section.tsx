"use client";
import { JSX } from "react";

import { SettingsFlow } from "@ory/kratos-client";
import { FilterFlowNodes } from "../helpers/filter-flow-nodes";
import { hasWebauthn } from "../helpers/utils";

export interface WebAuthnSettingsProps {
  flow: SettingsFlow;
}

export const WebAuthnSettingsSection = ({
  flow,
}: WebAuthnSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "webauthn",
    withoutDefaultGroup: true,
  };

  return hasWebauthn(flow.ui.nodes) ? (
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
