import {
  FilterNodesByGroups,
  filterNodesByGroups,
  getNodeInputType,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui";
import { UiNode } from "@ory/kratos-client";
import { JSX } from "react";

import { Node, NodeOverrideProps } from "./node";

export interface Props extends NodeOverrideProps {
  filter: FilterNodesByGroups;
  includeCSRF?: boolean;
}

export const FilterFlowNodes = ({
  filter,
  includeCSRF,
  ...overrides
}: Props): JSX.Element | null => {
  const getInputName = (node: UiNode): string =>
    isUiNodeInputAttributes(node.attributes) ? node.attributes.name : "";

  const nodes = filterNodesByGroups(filter)
    // we don't want to map the csrf token every time, only on the form level
    .filter((node) => includeCSRF || !(getInputName(node) === "csrf_token"))
    .map((node, k) => ({
      node: (
        <Node
          node={node}
          key={
            isUiNodeInputAttributes(node.attributes)
              ? node.attributes.name
              : isUiNodeImageAttributes(node.attributes)
                ? node.attributes.src
                : isUiNodeAnchorAttributes(node.attributes) ||
                    isUiNodeTextAttributes(node.attributes) ||
                    isUiNodeScriptAttributes(node.attributes)
                  ? node.attributes.id
                  : k
          }
          {...overrides}
        />
      ),
      hidden: getNodeInputType(node.attributes) === "hidden",
    }));

  const visibleNodes = nodes
    .filter((node) => !node.hidden)
    .map((node) => node.node);

  const hiddenNodes = nodes
    .filter((node) => node.hidden)
    .map((node) => node.node);

  return (
    <>
      {hiddenNodes.length > 0 ? <>{hiddenNodes}</> : null}
      {visibleNodes.length > 0 ? (
        <div className="flex flex-col gap-8 w-full">{visibleNodes}</div>
      ) : null}
    </>
  );
};
