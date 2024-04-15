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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import * as z from "zod";

const appearanceSchema = z.object({
  theme: z.string(),
});

export default function AppearanceForm() {
  const { setTheme, theme } = useTheme();

  const themes = ["dark", "light", "system"];

  const t = useTranslations("settings.appearance");

  const form = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: theme || "system",
    },
  });

  return (
    <Form {...form}>
      <form className="flex w-6/12 flex-col gap-4">
        <FormField
          control={form.control}
          name="theme"
          render={({ field: { ref: _ref, ...field } }) => (
            <FormItem>
              <FormLabel>{t("theme-switcher-label")}</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value) => {
                    setTheme(value);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("theme-switcher-placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {t("theme-label", { theme })}
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
