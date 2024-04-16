import AppearanceForm from "@/components/settings/appearance/appearance-form";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: `Appearance settings | ${APP_NAME}`,
};

export default function AppearanceSettingsPage() {
  const t = useTranslations("settings.appearance");
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <AppearanceForm />
    </div>
  );
}
