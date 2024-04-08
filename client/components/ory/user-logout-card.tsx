"use client";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("logout");

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
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
              {t("reject-button")}
            </Button>
            <Button
              type="submit"
              id="accept"
              value="Yes"
              name="submit"
              variant="default"
            >
              {t("accept-button")}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
