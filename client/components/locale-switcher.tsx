"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultLocale, locales } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function LocaleSwitcher({ locale }: { locale: string }) {
  const t = useTranslations("locale-switcher");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const params = useParams();

  const searchParams = useSearchParams();

  const handleLocaleChange = (locale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params, query: Object.fromEntries(searchParams) },
        { locale: locale }
      );
    });
  };

  return (
    <Select
      value={locale}
      defaultValue={defaultLocale}
      disabled={isPending}
      onValueChange={handleLocaleChange}
    >
      <SelectTrigger className="min-w-36">
        <SelectValue placeholder={t("placeholder")} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {t("locale", { locale })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
