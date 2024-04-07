import { JSX } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Message } from "../../message";

export interface ErrorProps {
  code: number;
  details: {
    docs: string;
    hint: string;
    rejectReason: string;
  };
  message: string;
  status: string;
  reason: string;
}

export interface AdditionalProps {
  forgotPasswordURL?: string;
  signupURL?: string;
  logoutURL?: string;
  loginURL?: string;
}

export interface MessageSectionProps {
  url?: string;
  buttonText: string;
  dataTestId?: string;
  text?: string;
}

export const MessageSection = ({
  text,
  url,
  buttonText,
  dataTestId,
}: MessageSectionProps): JSX.Element => (
  <Message className="text-muted-foreground">
    {text}&nbsp;
    <Link href={url}>
      <Button data-testid={dataTestId}>{buttonText}</Button>
    </Link>
  </Message>
);
