"use client";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import parseUserAgent from "@/utils/userAgent";
import { Session } from "@ory/client-fetch";
import RevokeSessionDialog from "./revoke-session-dialog";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function SessionCard({ session }: { session: Session }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
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
          <RevokeSessionDialog sessionId={session.id} />
        </div>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <p className="text-xs text-muted-foreground">
          created at {dateTimeFormat.format(session.issued_at)}
        </p>
        <Separator orientation="vertical" />
        <p className="text-xs text-muted-foreground">
          expires at {dateTimeFormat.format(session.expires_at)}
        </p>
      </CardFooter>
    </Card>
  );
}
