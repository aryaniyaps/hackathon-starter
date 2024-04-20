import CurrentSessionCard from "@/components/settings/sessions/current-session-card";
import SessionList from "@/components/settings/sessions/session-list";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: `Sessions settings | ${APP_NAME}`,
};

export default function SessionsSettingsPage() {
  const t = useTranslations("settings.sessions");
  return (
    <div className="flex h-full flex-col space-y-8">
      <h3 className="text-lg font-medium">{t("title")}</h3>
      <CurrentSessionCard />
      <SessionList />
    </div>
  );
}
