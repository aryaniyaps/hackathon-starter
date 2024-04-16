"use client";
import { UiNode, UiText, UiTextTypeEnum } from "@ory/client-fetch";
import { JSX } from "react";

import { cn } from "@/utils/style";
import { useFormatter, useTranslations } from "next-intl";
import { uiTextToFormattedMessage } from "./node";

export type NodeMessagesProps = {
  nodes?: UiNode[];
  uiMessages?: UiText[];
  gap: number;
  global?: boolean;
};

type NodeMessageProps = {
  message: UiText;
  key: string;
  global: boolean;
};

const NodeMessage = ({ key, message, global, ...props }: NodeMessageProps) => {
  const t = useTranslations();
  const formatter = useFormatter();

  return (
    <p
      key={key}
      data-testid={`ui/message/${message.id}`}
      className={cn({
        "text-destructive text-sm font-bold": !global,
        "text-destructive-foreground bg-destructive/75":
          message.type === UiTextTypeEnum.Error && global,
        "text-secondary-foreground bg-secondary/75":
          message.type === UiTextTypeEnum.Info && global,
        "text-center border px-6 py-4 rounded-lg": global,
      })}
      {...props}
    >
      {uiTextToFormattedMessage(message, formatter, t)}
    </p>
  );
};

export const NodeMessages = ({
  nodes,
  uiMessages,
  ...props
}: NodeMessagesProps): JSX.Element | null => {
  const { gap, global = false, ...messageProps } = props;
  const $groupMessages = nodes?.reduce<JSX.Element[]>(
    (groups, { messages }) => {
      groups.push(
        ...messages
          .map((message, key) => {
            return NodeMessage({
              message,
              global,
              key: `node-group-message-${message.id}-${key}`,
              ...messageProps,
            });
          })
          .filter(Boolean)
      );
      return groups;
    },
    []
  );

  const $messages = uiMessages?.map((message, key) =>
    NodeMessage({ message, global, key: `ui-messsage-${message.id}-${key}` })
  );

  const $allMessages = [...($groupMessages ?? []), ...($messages ?? [])];

  return $allMessages.length > 0 ? (
    <div className={cn(`flex flex-col gap-${gap} `)}>{$allMessages}</div>
  ) : null;
};
