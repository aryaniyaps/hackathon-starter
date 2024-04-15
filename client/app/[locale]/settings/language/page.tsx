import LanguageForm from "@/components/settings/language/language-form";
import { useTranslations } from "next-intl";

export default function LanguageSettingsPage() {
  const t = useTranslations("settings.language");
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <LanguageForm />
    </div>
  );
}
