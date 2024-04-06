import { getNodeLabel } from "@ory/integrations/ui";

import { Button } from "../ui/button";
import { NodeInputProps } from "./helpers";

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  return (
    <>
      <Button
        className="w-full"
        name={attributes.name}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node)}
      </Button>
    </>
  );
}