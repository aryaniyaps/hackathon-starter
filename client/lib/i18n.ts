import { Pathnames } from "next-intl/navigation";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export const locales = ["en", "de"];

export const localePrefix = "never";

export const defaultLocale = "en";

export const pathnames = {
  "/settings": "/settings",
  "/settings/appearance": "/settings/appearance",
  "/settings/internationalization": "/settings/internationalization",
  "/settings/sessions": "/settings/sessions",
  "/dashboard": "/dashboard",
  "/login": "/login",
  "/logout": "/logout",
  "/registration": "/registration",
  "/recovery": "/recovery",
  "/verification": "/verification",
} satisfies Pathnames<typeof locales>;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    // The time zone can either be statically defined, read from the
    // user profile if you store such a setting, or based on dynamic
    // request information like the locale or a cookie.
    timeZone: "Asia/Kolkata",
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      },
      number: {
        precise: {
          maximumFractionDigits: 5,
        },
      },
      now: new Date(),
    },
  };
});
