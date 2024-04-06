import { Alert, AlertTitle } from "@/components/ui/alert";
import { UiText } from "@ory/client";

interface MessageProps {
  message: UiText;
}

export const Message = ({ message }: MessageProps) => {
  return (
    <Alert variant={message.type === "error" ? "destructive" : "default"}>
      <AlertTitle data-testid={`ui/message/${message.id}`}>
        {message.text}
      </AlertTitle>
    </Alert>
  );
};

interface MessagesProps {
  messages?: Array<UiText>;
}

export const Messages = ({ messages }: MessagesProps) => {
  if (!messages) {
    // No messages? Do nothing.
    return null;
  }

  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
