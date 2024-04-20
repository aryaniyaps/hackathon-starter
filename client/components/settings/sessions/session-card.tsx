"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import getBrowserOSInfo, { getDeviceIcon } from "@/utils/userAgent";
import { Session, SessionDevice } from "@ory/kratos-client";
import { useFormatter } from "next-intl";
import RevokeSessionDialog from "./revoke-session-dialog";
import { UAParser } from "ua-parser-js";

function DeviceInformation({ device }: { device: SessionDevice }) {
  if (device.user_agent) {
    const parserResult = new UAParser(device.user_agent).getResult();
    const DeviceIcon = getDeviceIcon(parserResult);

    return (
      <div className="flex gap-2 items-center">
        <DeviceIcon className="w-6 h-6" />
        <div key={device.id} className="flex flex-col">
          <p className="font-bold">
            {device.ip_address} {device.location}
          </p>
          <p className="text-xs text-muted-foreground">
            {getBrowserOSInfo(parserResult)}
          </p>
        </div>
      </div>
    );
  }
  return (
    <p className="font-bold" key={device.id}>
      {device.ip_address} {device.location}
    </p>
  );
}

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
            {session.devices?.map((device) => (
              <DeviceInformation device={device} />
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
