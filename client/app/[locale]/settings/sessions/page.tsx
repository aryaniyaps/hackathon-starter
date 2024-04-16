import CurrentSessionCard from "@/components/settings/sessions/current-session-card";
import SessionList from "@/components/settings/sessions/session-list";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sessions settings | ${APP_NAME}`,
};

export default function SessionsSettingsPage() {
  return (
    <div className="flex h-full flex-col space-y-8">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Here are all the sessions that are currently active. Revoke any
          sessions that you do not recognize.
        </p>
      </div>
      <CurrentSessionCard />
      <SessionList />
    </div>
  );
}
