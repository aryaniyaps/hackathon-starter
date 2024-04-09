import { JSX } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  <p className="text-muted-foreground">
    {text}
    <Link href={url}>
      <Button data-testid={dataTestId} variant="link">
        {buttonText}
      </Button>
    </Link>
  </p>
);
