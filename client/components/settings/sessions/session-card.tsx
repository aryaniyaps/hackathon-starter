"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import getBrowserOSInfo, { getDeviceIcon } from "@/utils/userAgent";
import { Session, SessionDevice } from "@ory/kratos-client";
import { useTranslations } from "next-intl";
import RevokeSessionDialog from "./revoke-session-dialog";
import { UAParser } from "ua-parser-js";
import { Skeleton } from "@/components/ui/skeleton";

function DeviceInformation({ device }: { device: SessionDevice }) {
  if (device.user_agent) {
    const parserResult = new UAParser(device.user_agent).getResult();
    const DeviceIcon = getDeviceIcon(parserResult);

    return (
      <div className="flex gap-2 items-center">
        <DeviceIcon className="w-6 h-6" />
        <div className="flex flex-col">
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
    <p className="font-bold">
      {device.ip_address} {device.location}
    </p>
  );
}

export function SessionCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-6 h-6" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[175px]" />
            </div>
          </div>
          <Skeleton className="h-10 w-10" />
        </div>
      </CardHeader>
      <CardFooter className="flex gap-4">
        <Skeleton className="h-3 w-[150px]" />
        <Skeleton className="h-3 w-[150px]" />
      </CardFooter>
    </Card>
  );
}

export default function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const t = useTranslations("settings.sessions");
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            {session.devices?.map((device) => (
              <DeviceInformation device={device} key={device.id} />
            ))}
          </div>
          {isCurrentSession ? (
            <Badge>{t("current-session-label")}</Badge>
          ) : (
            <RevokeSessionDialog sessionId={session.id} />
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex gap-4">
        {session.issued_at ? (
          <p className="text-xs text-muted-foreground">
            {t("session-card-created-at-label", {
              createdAt: new Date(session.issued_at),
            })}
          </p>
        ) : null}
        {session.expires_at ? (
          <p className="text-xs text-muted-foreground">
            {t("session-card-expires-at-label", {
              expiresAt: new Date(session.expires_at),
            })}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
