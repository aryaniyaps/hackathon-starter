import { OAuth2Client, OAuth2ConsentRequest } from "@ory/client";

import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

/**
 * UserConsentCardProps
 * @param csrfToken - CSRF token
 * @param consent - Ory OAuth2ConsentRequest
 * @param cardImage - card image is usually the logo of the client
 * @param client_name - the client name to display to the user
 * @param requested_scope - a list of requested scope
 * @param client - Ory OAuth2Client
 * @param action - the URL used for the form action
 * @param className - css class overrides for the UserConsentCard
 */
export interface UserConsentCardProps {
  csrfToken: string;
  consent: OAuth2ConsentRequest;
  cardImage?: string | React.ReactElement;
  client_name: string;
  requested_scope?: string[];
  client?: OAuth2Client;
  action: string;
  className?: string;
}

export const UserConsentCard = ({
  csrfToken,
  consent,
  cardImage,
  client_name = "Unnamed Client",
  requested_scope = [],
  client,
  action,
  className,
}: UserConsentCardProps) => {
  const intl = useIntl();

  return (
    <Card className={className} image={cardImage}>
      <CardHeader>
        <CardTitle>{client_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} method="post">
          <input type="hidden" name="_csrf" value={csrfToken} />
          <input
            type="hidden"
            name="consent_challenge"
            value={consent?.challenge}
          />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 mb-8">
              <p>
                <FormattedMessage
                  id="consent.requested-permissions-label"
                  defaultMessage="The application requests access to the following permissions:"
                />
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {requested_scope.map((scope, idx) => (
                <div className="items-center flex space-x-2" key={scope}>
                  <Checkbox
                    id={`scope-${scope}-${idx}`}
                    value={scope}
                    name="grant_scope"
                  />
                  <Label htmlFor={`scope-${scope}-${idx}`}>{scope}</Label>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs">
                <FormattedMessage
                  id="consent.description"
                  defaultMessage="Only grant permissions if you trust this site or app. You do not need to accept all permissions."
                />
              </p>
            </div>
            <div className="flex flex-row">
              {client?.policy_uri && (
                <a href={client.policy_uri} target="_blank" rel="noreferrer">
                  <p className="text-xs">
                    <FormattedMessage
                      id="consent.privacy-policy-label"
                      defaultMessage="Privacy Policy"
                    />
                  </p>
                </a>
              )}
              {client?.tos_uri && (
                <a href={client.tos_uri} target="_blank" rel="noreferrer">
                  <p className="text-xs">
                    <FormattedMessage
                      id="consent.terms-of-service-label"
                      defaultMessage="Terms of Service"
                    />
                  </p>
                </a>
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-6">
              <div className="items-center flex space-x-2">
                <Checkbox id="remember" name="remember" />
                <Label htmlFor="remember">
                  {intl.formatMessage({
                    id: "consent.remember-tooltip",
                    defaultMessage: "remember my decision",
                  })}
                </Label>
              </div>
              <p className="text-xs">
                <FormattedMessage
                  id="consent.remember-label"
                  defaultMessage="Remember this decision for next time. The application will not be able to ask for additional permissions without your consent."
                />
              </p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <Button
                type="submit"
                id="reject"
                name="consent_action"
                value="reject"
                variant="destructive"
              >
                {intl.formatMessage({
                  id: "consent.action-reject",
                  defaultMessage: "Deny",
                })}
              </Button>
              <Button
                type="submit"
                id="accept"
                name="consent_action"
                value="accept"
                variant="default"
              >
                {intl.formatMessage({
                  id: "consent.action-accept",
                  defaultMessage: "Allow",
                })}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
