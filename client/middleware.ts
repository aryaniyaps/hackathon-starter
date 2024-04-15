import { ResponseError } from "@ory/client-fetch";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, localePrefix, locales } from "./lib/i18n";
import ory from "./lib/ory";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  // we don't need a locale prefix because the app runs
  // behind an authentication layer, and there's no need
  // for SEO (can change if needed!)
  localePrefix,
});

const protectedRoutes = [
  "/",
  "/dashboard",
  "/settings",
  "/settings/appearance",
];

// FIXME: should we redirect users from recovery and verification pages
// if they are already authenticated?
const authRoutes = ["/login", "/registration", "/recovery", "/verification"];

export default async function middleware(request: NextRequest) {
  // run internationalization middleware
  const response = intlMiddleware(request);

  // check user session
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    // TODO: run intl middleware here also before returning redirects?
    // TODO: write error page at /error or don't redirect there, we can let nextjs handle errors too
    try {
      const cookie = request.headers.get("cookie") || "";
      await ory.toSession({ cookie });
    } catch (err) {
      if (err instanceof ResponseError) {
        const data = await err.response.json();
        switch (err.response?.status) {
          // 422 we need to redirect the user to the location specified in the response
          case 422:
            return NextResponse.redirect(data.redirect_browser_to);
          //return router.push("/login", { query: { aal: "aal2" } })
          case 401:
            // The user is not logged in, so we redirect them to the login page.
            const redirectUrl = new URL("/login", request.url);
            redirectUrl.searchParams.set("return_to", request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
          default:
            console.log(err);
            return NextResponse.redirect(
              new URL(`/error?error=${JSON.stringify(err)}`, request.url)
            );
        }
      }
    }
  }
  return response;
}

export const config = {
  matcher: [
    // Skip all paths that should not be internationalized
    "/((?!_next|.*\\..*).*)",
  ],
};
