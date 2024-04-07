import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNode,
  VerificationFlow,
} from "@ory/client";
import { getNodeId, isUiNodeInputAttributes } from "@ory/integrations/ui";
import React, { useEffect, useState } from "react";
import { Messages } from "./messages";
import { Node } from "./node";

export type Values = {
  [key: string]: any;
};

export type Methods =
  | "oidc"
  | "password"
  | "profile"
  | "totp"
  | "webauthn"
  | "passkey"
  | "link"
  | "lookup_secret";

export type Props<T> = {
  flow:
    | LoginFlow
    | RegistrationFlow
    | SettingsFlow
    | VerificationFlow
    | RecoveryFlow;
  only?: Methods;
  onSubmit: (values: T) => Promise<void>;
  hideGlobalMessages?: boolean;
};

export default function Flow<T extends Values>({
  flow,
  only,
  onSubmit,
  hideGlobalMessages,
}: Props<T>) {
  const [values, setValues] = useState<T>({});
  const [isLoading, setLoading] = useState(false);

  const emptyState = () => ({}) as T;

  const initializeValues = (nodes: Array<UiNode> = []) => {
    const newValues = emptyState();
    nodes.forEach((node) => {
      if (isUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type === "button" ||
          node.attributes.type === "submit"
        ) {
          return;
        }
        newValues[node.attributes.name as keyof T] = node.attributes.value;
      }
    });
    setValues(newValues);
  };

  const filterNodes = (): Array<UiNode> => {
    // if (!flow) {
    //   return [];
    // }
    return flow.ui.nodes.filter(
      ({ group }) => !only || group === "default" || group === only
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement | null;

    if (form) {
      const formData = new FormData(form);
      const body = Object.fromEntries(formData) as T;

      if (event.nativeEvent && "submitter" in event.nativeEvent) {
        const method = event.nativeEvent.submitter;
        body[method.name] = method.value;
      }

      setLoading(true);

      try {
        await onSubmit({ ...body, ...values });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    initializeValues(filterNodes());
  }, [flow]);

  if (!flow) {
    return null;
  }

  const nodes = filterNodes();

  return (
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full"
    >
      {!hideGlobalMessages && <Messages messages={flow.ui.messages} />}
      {nodes.map((node, index) => (
        <Node
          key={`${getNodeId(node)}-${index}`}
          disabled={isLoading}
          node={node}
          value={values[getNodeId(node) as keyof T]}
          dispatchSubmit={handleSubmit}
          setValue={(value) =>
            new Promise((resolve) => {
              setValues((currentValues) => ({
                ...currentValues,
                [getNodeId(node)]: value,
              }));
              resolve();
            })
          }
        />
      ))}
    </form>
  );
}
