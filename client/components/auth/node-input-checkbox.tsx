import { Checkbox } from "@/components/ui/checkbox";
import { getNodeLabel } from "@ory/integrations/ui";

import { Label } from "../ui/label";
import { NodeInputProps } from "./helpers";

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled,
}: NodeInputProps) {
  const id = Math.random().toString(36).substring(2);

  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id={id}
        name={attributes.name}
        defaultChecked={attributes.value}
        disabled={attributes.disabled || disabled}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>{getNodeLabel(node)}</Label>
        <p className="text-sm text-muted-foreground">
          {node.messages.map(({ text }) => text).join("\n")}
        </p>
      </div>
    </div>
  );
}
