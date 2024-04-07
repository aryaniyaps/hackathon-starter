import { UiNode, UiText } from "@ory/client";
import { JSX } from "react";
import { useIntl } from "react-intl";

import { gridStyle, Severity } from "../../../theme";
import { uiTextToFormattedMessage } from "./node";

export type NodeMessagesProps = {
  nodes?: UiNode[];
  uiMessages?: UiText[];
};

type NodeMessageProps = {
  message: UiText;
  key: string;
};

const NodeMessage = ({ key, message, ...props }: NodeMessageProps) => {
  const intl = useIntl();
  return (
    <p
      key={key}
      data-testid={`ui/message/${message.id}`}
      severity={message.type as Severity}
      {...props}
    >
      {uiTextToFormattedMessage(message, intl)}
    </p>
  );
};

export const NodeMessages = ({
  nodes,
  uiMessages,
  ...props
}: NodeMessagesProps): JSX.Element | null => {
  const { gap, direction, ...messageProps } = props;
  const $groupMessages = nodes?.reduce<JSX.Element[]>(
    (groups, { messages }) => {
      groups.push(
        ...messages
          .map((message, key) => {
            return NodeMessage({
              message,
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
    NodeMessage({ message, key: `ui-messsage-${message.id}-${key}` })
  );

  const $allMessages = [...($groupMessages ?? []), ...($messages ?? [])];

  return $allMessages.length > 0 ? (
    <div
      className={gridStyle({
        gap: gap ?? 16,
        direction: direction,
      })}
    >
      {$allMessages}
    </div>
  ) : null;
};
