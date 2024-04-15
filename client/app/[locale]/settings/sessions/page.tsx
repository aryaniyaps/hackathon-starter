"use client";
import RevokeOtherSessionsDialog from "@/components/settings/sessions/revoke-other-sessions-dialog";
import SessionCard from "@/components/settings/sessions/session-card";
import SessionList from "@/components/settings/sessions/session-list";
import useCurrentSession from "@/lib/hooks/useCurrentSession";

export default function SessionsSettingsPage() {
  const { data: session } = useCurrentSession();

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Here are all the sessions that are currently active. Revoke any
          sessions that you do not recognize.
        </p>
      </div>
      <SessionCard session={session} isCurrentSession />
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Active sessions (count)</h2>
        <RevokeOtherSessionsDialog />
      </div>
      <SessionList />
    </div>
  );
}
