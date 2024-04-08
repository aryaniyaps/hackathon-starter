import { AxiosError } from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import ory from "./lib/ory";

import createMiddleware from "next-intl/middleware";

const i18nMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "de"],

  // Used when no locale matches
  defaultLocale: "en",
  // we don't need a locale prefix because the app runs
  // behind an authentication layer, and there's no need
  // for SEO (can change if needed!)
  localePrefix: "never",
  // we aren't generating alternate links
  // because locale prefix is set to `never`
  alternateLinks: false,
});

export default async function middleware(request: NextRequest) {
  // run internationalization middleware
  i18nMiddleware(request);

  try {
    const { status, data } = await ory.toSession({
      cookie: request.headers.get("cookie") || "",
    });

    if (status !== 200) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      switch (err.response?.status) {
        // 422 we need to redirect the user to the location specified in the response
        case 422:
          return NextResponse.redirect(err.response.data.redirect_browser_to);
        //return router.push("/login", { query: { aal: "aal2" } })
        case 401:
          // The user is not logged in, so we redirect them to the login page.
          return NextResponse.redirect(new URL("/login", request.url));
        case 404:
          // the SDK is not configured correctly
          // we set this up so you can debug the issue in the browser
          return NextResponse.redirect(
            new URL(`/error?error=${JSON.stringify(err)}`, request.url)
          );
        default:
          return NextResponse.redirect(
            new URL(`/error?error=${JSON.stringify(err)}`, request.url)
          );
      }
    }
  }
}

export const config = {
  matcher: ["/", "/:path*"],
};
