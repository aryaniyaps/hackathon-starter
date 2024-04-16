import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export default function SettingsHeader() {
  const t = useTranslations("settings");

  return (
    <div className="border-b p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="font-semibold">{t("title")}</h1>
        <Link href="/dashboard">
          <Button variant="link" size="sm">
            {t("back-to-dashboard-label")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
