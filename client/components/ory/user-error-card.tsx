"use client";
import { FlowError } from "@ory/client";
import { JSX } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";
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
  const t = useTranslations("error");

  const err = error.error as errorMessage;
  const status = err.code;
  const is500 = status >= 500;

  if (!title) {
    switch (status) {
      case 404:
        title = t("title-not-found");
        break;
      case 500:
        title = t("title-internal-server-error");
        break;
      default:
        title = t("title");
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
            {t("description")}
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
            {t("support-email-link")}
            <Link href={`mailto:${contactSupportEmail}`}>
              <Button variant="link">&nbsp;{contactSupportEmail}</Button>
            </Link>
          </p>
        )}
        <p>
          <Link href={backUrl}>
            <Button variant="link">{t("back-button")}</Button>
          </Link>
        </p>
      </div>
    </Card>
  );
};
