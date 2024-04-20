"use client";
import { Button } from "@/components/ui/button";
import useSessions from "@/lib/hooks/useSessions";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMemo } from "react";
import RevokeOtherSessionsDialog from "./revoke-other-sessions-dialog";
import SessionCard, { SessionCardSkeleton } from "./session-card";
import { useTranslations } from "next-intl";

function SessionListSkeleton() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <SessionCardSkeleton />
      <SessionCardSkeleton />
      <SessionCardSkeleton />
      <SessionCardSkeleton />
    </div>
  );
}
// TODO: fix duplicate session cards?
export default function SessionList() {
  const t = useTranslations("settings.sessions");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSessions();

  const allSessions = useMemo(() => {
    return data ? data.pages.flatMap((page) => page.sessions) : [];
  }, [data]);

  const isEmpty = useMemo(() => {
    return allSessions.length === 0;
  }, [allSessions]);

  return (
    <div className="flex flex-col gap-8 h-full relative">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">{t("active-sessions-label")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("active-sessions-description")}
          </p>
        </div>
        <RevokeOtherSessionsDialog disabled={isEmpty} />
      </div>
      {!data ? (
        <SessionListSkeleton />
      ) : isEmpty ? (
        <p className="w-full text-muted-foreground font-semibold">
          {t("active-sessions-empty-message")}
        </p>
      ) : (
        <div className="flex h-full flex-1 flex-col gap-4">
          {allSessions.map((session) => (
            <SessionCard session={session} key={session.id} />
          ))}
          {hasNextPage ? (
            <Button
              className="w-full"
              variant="secondary"
              onClick={async () => await fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
