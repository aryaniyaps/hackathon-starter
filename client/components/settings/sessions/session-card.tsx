"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import parseUserAgent from "@/utils/userAgent";
import { Session } from "@ory/kratos-client";
import { useFormatter } from "next-intl";
import RevokeSessionDialog from "./revoke-session-dialog";

export default function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const formatter = useFormatter();
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p>{session.id}</p>
            {session.devices?.map((device) => (
              <div key={device.id} className="flex flex-col">
                <p className="font-bold">
                  {device.ip_address} {device.location}
                </p>
                {device.user_agent ? (
                  <p className="text-xs text-muted-foreground">
                    {parseUserAgent(device.user_agent)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          {isCurrentSession ? (
            <Badge>Current session</Badge>
          ) : (
            <RevokeSessionDialog sessionId={session.id} />
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex gap-4">
        {session.issued_at ? (
          <p className="text-xs text-muted-foreground">
            created {formatter.relativeTime(new Date(session.issued_at))}
          </p>
        ) : null}
        {session.expires_at ? (
          <p className="text-xs text-muted-foreground">
            expires in {formatter.relativeTime(new Date(session.expires_at))}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
