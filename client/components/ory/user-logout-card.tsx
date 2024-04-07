"use client";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";

/**
 * UserLogoutCardProps
 * @param csrfToken - CSRF token
 * @param challenge - Ory LogoutRequest challenge
 * @param action - the URL used for the form action
 * @param className - css class overrides for the UserLogoutCard
 */
export interface UserLogoutCardProps {
  csrfToken: string;
  challenge: string;
  action: string;
  className?: string;
}

/**
 * UserLogoutCard renders an OAuth2 logout card for the user
 * @see UserLogoutCardProps
 */
export const UserLogoutCard = ({
  csrfToken,
  challenge,
  action,
  className,
}: UserLogoutCardProps) => {
  const intl = useIntl();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="logout.title"
            defaultMessage="Do you wish to log out?"
          />
        </CardTitle>
      </CardHeader>
      <form action={action} method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <input type="hidden" name="challenge" value={challenge} />
        <div className="flex flex-col gap-8">
          <div className="flex flex-row justify-between items-center">
            <Button
              type="submit"
              id="reject"
              value="No"
              name="submit"
              variant="destructive"
            >
              {intl.formatMessage({
                id: "logout.reject-button",
                defaultMessage: "No",
              })}
            </Button>
            <Button
              type="submit"
              id="accept"
              value="Yes"
              name="submit"
              variant="default"
            >
              {intl.formatMessage({
                id: "logout.accept-button",
                defaultMessage: "Yes",
              })}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
