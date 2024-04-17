"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { getQueryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  const queryClient = getQueryClient();
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Asia/Kolkata"
        now={new Date()}
      >
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </TooltipProvider>
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
}
