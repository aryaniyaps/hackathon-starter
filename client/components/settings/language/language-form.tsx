"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const languageSchema = z.object({
  language: z.string(),
});

export default function LanguageForm() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [isPending, startTransition] = useTransition();

  const locale = useLocale();

  const t = useTranslations("");

  const form = useForm<z.infer<typeof languageSchema>>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: locale,
    },
  });

  const handleLocaleChange = (locale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: locale }
      );
    });
  };

  return (
    <Form {...form}>
      <form className="flex w-6/12 flex-col gap-4">
        <FormField
          control={form.control}
          name="language"
          render={({ field: { ref: _ref, ...field } }) => (
            <FormItem>
              <FormLabel>{t("settings.language.switcher-label")}</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={locale}
                  disabled={isPending}
                  onValueChange={handleLocaleChange}
                >
                  <SelectTrigger className="min-w-36">
                    <SelectValue
                      placeholder={t("locale-switcher.placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.map((locale) => (
                      <SelectItem key={locale} value={locale}>
                        {t("locale-switcher.locale", { locale })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
