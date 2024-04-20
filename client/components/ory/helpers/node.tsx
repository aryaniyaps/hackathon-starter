import {
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui";
import { UiNode, UiNodeAttributes, UiText } from "@ory/kratos-client";
import { JSX, MouseEvent, useId } from "react";

import { Icons } from "@/components/icons";
import { Button, ButtonProps } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/style";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { NodeMessages } from "./node-messages";

interface ButtonSubmit {
  type: "submit" | "reset" | "button" | undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  formNoValidate?: boolean;
  name: string;
  value: string;
}

export interface NodeOverrideProps {
  buttonOverrideProps?: Partial<ButtonProps>;
  buttonSocialOverrideProps?: Partial<ButtonProps>;
}

export type NodeProps = {
  node: UiNode;
  className?: string;
} & NodeOverrideProps;

export const getNodeLabel = (node: UiNode): UiText | undefined => {
  const attributes = node.attributes;
  if (isUiNodeAnchorAttributes(attributes)) {
    return attributes.title;
  }

  if (isUiNodeImageAttributes(attributes)) {
    return node.meta.label;
  }

  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.label) {
      return attributes.label;
    }
  }

  return node.meta.label;
};

/**
 * Converts a UiText to a FormattedMessage.
 * The UiText contains the id of the message and the context.
 * The context is used to inject values into the message from Kratos, e.g. a timestamp.
 * For example a UI Node from Kratos might look like this:
 *
 * \{
 *  "type":"input",
 *  "group":"default",
 *  "attributes": \{
 *      "name":"traits.email",
 *      "type":"email",
 *      "required":true,
 *      "autocomplete":"email",
 *      "disabled":false,
 *      "node_type":"input"
 *  \},
 *  "messages":[],
 *  "meta": \{
 *    "label": \{
 *      "id":1070002,
 *      "text":"E-Mail",
 *      "type":"info",
 *      "context":\{
 *        "title":"E-Mail"
 *      \},
 *    \}
 *  \}
 * \}
 *
 * The context has the key "title" which matches the formatter template name "\{title\}"
 * An example translation file would look like this:
 * \{
 *  "identities.messages.1070002": "\{title\}"
 * \}
 *
 * The formwatter would then take the meta.label.id and look for the translation with the key matching the id.
 * It would then replace the template "\{title\}" with the value from the context with the key "title".
 *
 * @param uiText - The UiText is part of the UiNode object sent by Kratos when performing a flow.
 */
export const uiTextToFormattedMessage = (
  { id, context = {}, text }: Omit<UiText, "type">,
  formatter: ReturnType<typeof useFormatter>,
  t: ReturnType<typeof useTranslations<string>>
) => {
  const contextInjectedMessage = Object.entries(context).reduce(
    (accumulator, [key, value]) => {
      // context might provide an array of objects instead of a single object
      // for example when looking up a recovery code
      /*
      *
      {
      "text": {
          "id": 1050015,
          "text": "3r9noma8, tv14n5tu, ...",
          "type": "info",
          "context": {
              "secrets": [
                  {
                      "context": {
                          "secret": "3r9noma8"
                      },
                      "id": 1050009,
                      "text": "3r9noma8",
                      "type": "info"
                  },
                  {
                      "context": {
                          "secret": "tv14n5tu"
                      },
                      "id": 1050009,
                      "text": "tv14n5tu",
                      "type": "info"
                  },
              ]
          }
      },
      "id": "lookup_secret_codes",
      "node_type": "text"
      }
      */
      if (Array.isArray(value)) {
        return {
          ...accumulator,
          [key]: value,
          [key + "_list"]: formatter.list(value),
        };
      } else if (key.endsWith("_unix")) {
        if (typeof value === "number") {
          return {
            ...accumulator,
            [key]: formatter.dateTime(new Date(value * 1000)),
            [key + "_since"]: formatter.dateTimeRange(
              new Date(value),
              new Date()
            ),
            [key + "_since_minutes"]: Math.abs(
              (value - new Date().getTime() / 1000) / 60
            ).toFixed(2),
            [key + "_until"]: formatter.dateTimeRange(
              new Date(),
              new Date(value)
            ),
            [key + "_until_minutes"]: Math.abs(
              (new Date().getTime() / 1000 - value) / 60
            ).toFixed(2),
          };
        }
      }
      return {
        ...accumulator,
        [key]: value as string | number,
      };
    },
    {}
  );

  // FIXME: we could add text here, but it won't be localized! we need some way to add title here
  return t(`identities.messages.${id}`, contextInjectedMessage);
};

function dataAttributes(attrs: UiNodeAttributes): Record<string, string> {
  return Object.entries(attrs).reduce<Record<string, string>>(
    (accumulator, [key, value]) => {
      if (key.startsWith("data-")) {
        accumulator[key] = value as string;
      }
      return accumulator;
    },
    {}
  );
}

/*
 * Render the relevant icon for the given social platform provider.
 */
function getSocialButtonIcon(platform: string): JSX.Element | null {
  switch (platform.toLowerCase()) {
    case "google":
      return <Icons.google className="w-4 h-4" />;
    default:
      return null;
  }
}

export const Node = ({
  node,
  className,
  buttonOverrideProps,
  buttonSocialOverrideProps,
}: NodeProps): JSX.Element | null => {
  const t = useTranslations();
  const formatter = useFormatter();

  const labelId = useId();

  const formatMessage = (uiText: UiText | undefined) => {
    if (!uiText) {
      return "";
    }

    return uiTextToFormattedMessage(uiText, formatter, t);
  };

  if (isUiNodeImageAttributes(node.attributes)) {
    return (
      <div
        className="flex flex-col gap-2"
        data-testid={`node/image/${node.attributes.id}`}
      >
        <p className="text-sm">{formatMessage(node.meta.label)}</p>
        <Image
          src={node.attributes.src}
          alt={formatMessage(node.meta.label)}
          width={node.attributes.width}
          height={node.attributes.height}
          {...dataAttributes(node.attributes)}
        />
      </div>
    );
  } else if (isUiNodeTextAttributes(node.attributes)) {
    const id = node.attributes.id;
    return node.attributes.text.id === 1050015 ? (
      <div
        className="inline-flex flex-wrap gap-8 max-w-fit items-center"
        data-testid={`node/text/${id}`}
      >
        <p
          className="basis-full"
          data-testid={`node/text/${node.attributes.id}/label`}
        >
          {formatMessage(node.meta.label)}
        </p>
        {(
          node.attributes.text.context as {
            secrets: UiText[];
          }
        ).secrets.map((text: UiText, index) => (
          <pre data-testid={`node/text/lookup_secret_codes/text`} key={index}>
            <code>{formatMessage(text)}</code>
          </pre>
        ))}
      </div>
    ) : (
      <div className="flex flex-col gap-2" data-testid={`node/text/${id}`}>
        <p data-testid={`node/text/${node.attributes.id}/label`}>
          {formatMessage(node.meta.label)}
        </p>
        <pre data-testid={`node/text/${id}/text`}>
          <code>{formatMessage(node.attributes.text)}</code>
        </pre>
      </div>
    );
  } else if (isUiNodeInputAttributes(node.attributes)) {
    const attrs = node.attributes;
    const nodeType = attrs.type;

    const isSocial =
      (attrs.name === "provider" ||
        attrs.name === "link" ||
        attrs.name === "unlink") &&
      node.group === "oidc";

    const submit: ButtonSubmit = {
      type: attrs.type as "submit" | "reset" | "button" | undefined,
      name: attrs.name,
      ...(attrs.value && { value: attrs.value as string }),
    } as ButtonSubmit;

    switch (nodeType) {
      case "button":
      case "submit":
        if (isSocial) {
          submit.formNoValidate = true;
          submit.onClick = (e) => {
            e.currentTarget.type = "submit";
            e.currentTarget.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          };
        }

        if (attrs.onclick) {
          // This is a bit hacky but it wouldn't work otherwise.
          const oc = attrs.onclick;
          submit.onClick = () => {
            eval(oc);
          };
        }

        // the recovery code resend button
        if (
          node.meta.label?.id === 1070007 || // TODO: remove this once everyone has migrated to the fix (https://github.com/ory/kratos/pull/3067)
          node.meta.label?.id === 1070008
        ) {
          // on html forms the required flag on an input field will prevent the form from submitting.
          // we disable validation for this form since the resend button does not rely on any input fields
          submit.formNoValidate = true;
        }

        return isSocial ? (
          <Button
            className={cn("w-full flex gap-2", className)}
            variant={"secondary"}
            disabled={attrs.disabled}
            {...(buttonSocialOverrideProps && buttonSocialOverrideProps)}
            {...submit}
            {...dataAttributes(attrs)}
          >
            {/* display logo based on attrs.value here */}
            {getSocialButtonIcon(attrs.value as string)}
            {formatMessage(getNodeLabel(node))}
          </Button>
        ) : (
          <Button
            className={cn("w-full", className)}
            variant={"default"}
            disabled={attrs.disabled}
            {...(buttonOverrideProps && buttonOverrideProps)}
            {...submit}
            {...dataAttributes(attrs)}
          >
            {formatMessage(getNodeLabel(node))}
          </Button>
        );
      case "datetime-local":
      case "checkbox":
        return (
          <div
            className="items-center flex space-x-2"
            data-testid={`node/input/${attrs.name}`}
          >
            <Checkbox
              id={labelId}
              name={attrs.name}
              required={attrs.required}
              defaultValue={attrs.value as string | number | string[]}
              disabled={attrs.disabled}
              defaultChecked={Boolean(attrs.value)}
              {...dataAttributes(attrs)}
            />
            <Label className={className} htmlFor={labelId}>
              {formatMessage(getNodeLabel(node))}
            </Label>
          </div>
        );
      default:
        return (
          <div
            className={cn("flex flex-col gap-4", {
              hidden: attrs.type === "hidden",
            })}
            data-testid={`node/input/${attrs.name}`}
          >
            <Label htmlFor={labelId}>{formatMessage(getNodeLabel(node))}</Label>
            <Input
              id={labelId}
              className={className}
              name={attrs.name}
              type={attrs.type}
              autoComplete={
                attrs.autocomplete ??
                (attrs.name === "identifier" ? "username" : "")
              }
              defaultValue={attrs.value as string | number | string[]}
              required={attrs.required}
              disabled={attrs.disabled}
              pattern={attrs.pattern}
              {...dataAttributes(attrs)}
            />
            <NodeMessages nodes={[node]} gap={4} />
          </div>
        );
    }
  } else if (isUiNodeAnchorAttributes(node.attributes)) {
    return (
      <Link href={node.attributes.href} className="flex justify-center">
        <Button
          variant="link"
          title={formatMessage(node.attributes.title)}
          data-testid={`node/anchor/${node.attributes.id}`}
          className={className}
          {...dataAttributes(node.attributes)}
        >
          {formatMessage(node.attributes.title)}
        </Button>
      </Link>
    );
  }
  return null;
};
