import { FlowError } from "@ory/client";
import { JSX } from "react";

import Link from "next/link";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";

/**
 * UserErrorCardProps
 * @param title - the title of the error card
 * @param error - Ory FlowError
 * @param backUrl - the URL to redirect the user to
 * @param contactSupportEmail - the email address to contact support
 * @param className - css class overrides for the UserErrorCard
 */
export interface UserErrorCardProps {
  title?: string;
  error: FlowError;
  backUrl: string;
  contactSupportEmail?: string;
  className?: string;
}

interface errorMessage {
  id: string;
  message: string;
  reason: string;
  status: string;
  code: number;
}

/**
 * UserErrorCard renders an error card for the user
 * @see UserErrorCardProps
 */
export const UserErrorCard = ({
  title,
  error,
  backUrl,
  contactSupportEmail,
  className,
}: UserErrorCardProps): JSX.Element => {
  const intl = useIntl();

  const err = error.error as errorMessage;
  const status = err.code;
  const is500 = status >= 500;

  if (!title) {
    switch (status) {
      case 404:
        title = intl.formatMessage({
          id: "error.title-not-found",
          defaultMessage: "404 - Page not found",
        });
        break;
      case 500:
        title = intl.formatMessage({
          id: "error.title-internal-server-error",
          defaultMessage: "Internal Server Error",
        });
        break;
      default:
        title = intl.formatMessage({
          id: "error.title",
          defaultMessage: "An error occurred",
        });
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-12" data-testid="ui/error/message">
        {!is500 && (
          <p className="text-destructive">
            <FormattedMessage
              id="error.description"
              defaultMessage="An error occurred with the following message:"
            />
            &nbsp;
            {err.reason}
          </p>
        )}
        {/* Codebox goes here, replaced by div for now */}
        <div
          data-testid="code-box"
          // toggleText="Error details"
        >
          {JSON.stringify(error, null, 2)}
        </div>
        {contactSupportEmail && (
          <p className="text-muted-foreground">
            <FormattedMessage
              id="error.support-email-link"
              description="A label and link below the error. The link href is 'mailto:{contactSupportEmail}'."
              defaultMessage="If the problem persists, please contact <a>{contactSupportEmail}</a>"
              values={{
                contactSupportEmail,
                a: (chunks) => (
                  <Link href={`mailto:${contactSupportEmail}`}>
                    <Button variant="link">&nbsp;{chunks}</Button>
                  </Link>
                ),
              }}
            />
          </p>
        )}
        <p>
          <Link href={backUrl}>
            <Button variant="link">
              <FormattedMessage
                id="error.back-button"
                defaultMessage="Go Back"
              />
            </Button>
          </Link>
        </p>
      </div>
    </Card>
  );
};
