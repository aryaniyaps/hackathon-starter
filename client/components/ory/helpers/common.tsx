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
  isSubmittable?: boolean;
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
  isSubmittable = false,
}: MessageSectionProps): JSX.Element => {
  if (isSubmittable) {
    return (
      <form action={url} method="POST" className="text-muted-foreground">
        {text}
        <Button data-testid={dataTestId} type="submit" variant="link">
          {buttonText}
        </Button>
      </form>
    );
  }

  return (
    <p className="text-muted-foreground">
      {text}
      <Link href={url}>
        <Button data-testid={dataTestId} variant="link">
          {buttonText}
        </Button>
      </Link>
    </p>
  );
};
