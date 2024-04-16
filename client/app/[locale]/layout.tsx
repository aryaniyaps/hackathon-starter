import { Toaster } from "@/components/ui/sonner";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { useMessages } from "next-intl";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_NAME}`,
};

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontSans.variable}>
        <main>
          <Providers locale={locale} messages={messages}>
            {children}
          </Providers>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
