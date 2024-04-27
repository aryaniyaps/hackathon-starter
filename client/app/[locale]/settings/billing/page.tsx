import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: `Billing settings | ${APP_NAME}`,
};

export default function BillingSettingsPage() {
  const t = useTranslations("settings.billing");
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
    </div>
  );
}
