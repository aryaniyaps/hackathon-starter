"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider
        refetchInterval={
          60 * 4 // 4 minutes
        }
      >
        {children}
      </SessionProvider>
    </NextThemesProvider>
  );
}
