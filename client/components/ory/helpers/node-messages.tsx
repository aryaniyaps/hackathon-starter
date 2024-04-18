"use client";
import { UiNode, UiText, UiTextTypeEnum } from "@ory/kratos-client";
import { JSX } from "react";

import { cn } from "@/utils/style";
import { useFormatter, useTranslations } from "next-intl";
import { uiTextToFormattedMessage } from "./node";

export type NodeMessagesProps = {
  nodes?: UiNode[];
  uiMessages?: UiText[];
  gap: number;
  isGlobal?: boolean;
};

type NodeMessageProps = {
  message: UiText;
  key: string;
  isGlobal: boolean;
};

const NodeMessage = ({
  key,
  message,
  isGlobal,
  ...props
}: NodeMessageProps) => {
  const t = useTranslations();
  const formatter = useFormatter();

  return (
    <p
      key={key}
      data-testid={`ui/message/${message.id}`}
      className={cn({
        "text-destructive text-sm font-bold": !isGlobal,
        "text-destructive-foreground bg-destructive/75":
          message.type === UiTextTypeEnum.Error && isGlobal,
        "text-secondary-foreground bg-secondary/75":
          (message.type === UiTextTypeEnum.Info ||
            message.type === UiTextTypeEnum.Success) &&
          isGlobal,
        "text-center border px-6 py-4 rounded-lg": isGlobal,
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
  const { gap, isGlobal: global = false, ...messageProps } = props;
  const $groupMessages = nodes?.reduce<JSX.Element[]>(
    (groups, { messages }) => {
      groups.push(
        ...messages
          .map((message, key) => {
            return NodeMessage({
              message,
              isGlobal: global,
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
    NodeMessage({
      message,
      isGlobal: global,
      key: `ui-messsage-${message.id}-${key}`,
    })
  );

  const $allMessages = [...($groupMessages ?? []), ...($messages ?? [])];

  return $allMessages.length > 0 ? (
    <div className={cn(`flex flex-col gap-${gap} `)}>{$allMessages}</div>
  ) : null;
};
