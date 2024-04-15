"use client";
import RevokeOtherSessionsDialog from "@/components/settings/sessions/revoke-other-sessions-dialog";
import SessionList from "@/components/settings/sessions/session-list";

export default function SessionsSettingsPage() {
  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Here are all the sessions that are currently active. Revoke any
          sessions that you do not recognize.
        </p>
      </div>
      <div className="flex">
        <RevokeOtherSessionsDialog />
      </div>
      <SessionList />
    </div>
  );
}
