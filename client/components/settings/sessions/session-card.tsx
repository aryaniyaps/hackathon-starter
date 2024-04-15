"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
          <p>SESSION HEADER</p>
          <RevokeSessionDialog sessionId={session.id} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p>Devices</p>
          <div>
            {session.devices?.map((device) => (
              <div className="flex flex-col gap-2" key={device.id}>
                <p>{device.id}</p>
                <p>{device.ip_address}</p>
                <p>{device.location}</p>
                <p>{device.user_agent}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
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
