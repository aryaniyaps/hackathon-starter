"use client";
import { Button } from "@/components/ui/button";
import useSessions from "@/lib/hooks/useSessions";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Fragment, useMemo } from "react";
import RevokeOtherSessionsDialog from "./revoke-other-sessions-dialog";
import SessionCard from "./session-card";
import { Icons } from "@/components/icons";

// TODO: handle empty state (no other active sessions)
// TODO: fix duplicate session cards?
export default function SessionList() {
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
          <h3 className="font-semibold">Active sessions</h3>
          <p className="text-sm text-muted-foreground">
            Revoke any sessions that you do not recognize.
          </p>
        </div>
        <RevokeOtherSessionsDialog disabled={isEmpty} />
      </div>
      {isEmpty ? (
        <p className="w-full text-muted-foreground font-semibold">
          No active sessions found!
        </p>
      ) : (
        <ScrollArea className="h-full flex-1 overflow-y-auto">
          <div className="flex h-full flex-1 flex-col gap-4">
            {data.pages.map((page, i) => (
              <Fragment key={i}>
                {page.sessions.map((session) => (
                  <SessionCard session={session} key={session.id} />
                ))}
              </Fragment>
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
        </ScrollArea>
      )}
    </div>
  );
}
