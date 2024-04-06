import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { NodeInputProps } from "./helpers";

export function NodeInputDefault<T>(props: NodeInputProps) {
  const { node, attributes, value = "", setValue, disabled } = props;

  const id = Math.random().toString(36).substring(2);

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  function onClick() {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick);
      run();
    }
  }

  // Render a generic text input field.
  return (
    <>
      <Label htmlFor={id}>{node.meta.label?.text}</Label>
      <Input
        id={id}
        onClick={onClick}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        type={attributes.type}
        name={attributes.name}
        value={value}
        disabled={attributes.disabled || disabled}
      />
      {node.messages.map(({ text, id }, k) => (
        <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
          {text}
        </span>
      ))}
    </>
  );
}
