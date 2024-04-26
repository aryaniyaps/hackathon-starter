import { ResponseError } from "@ory/client-fetch";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, localePrefix, locales } from "./lib/i18n";
import { kratosFetch } from "./lib/kratos";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/settings/appearance",
  "/settings/internationalization",
  "/settings/sessions",
  "/logout",
  "/verification",
];

const authRoutes = ["/login", "/registration", "/recovery"];

async function handleProtectedRoutes(
  request: NextRequest,
  response: NextResponse
) {
  try {
    const cookie = request.headers.get("cookie") || "";
    await kratosFetch.toSession({ cookie });
    return NextResponse.next(response);
  } catch (err) {
    if (err instanceof ResponseError) {
      const data = await err.response.json();
      switch (err.response?.status) {
        case 422:
          return NextResponse.redirect(data.redirect_browser_to);
        case 401:
          const redirectUrl = new URL("/login", request.url);
          redirectUrl.searchParams.set("return_to", request.nextUrl.pathname);
          return NextResponse.redirect(redirectUrl);
        default:
          console.error(err);
          return NextResponse.next(response);
      }
    }
    console.error(err);
    return NextResponse.next(response);
  }
}

async function handleAuthRoutes(request: NextRequest, response: NextResponse) {
  const cookie = request.headers.get("cookie") || "";
  try {
    // exempt reauthentication flows
    if (request.nextUrl.pathname === "/login") {
      const flowId = request.nextUrl.searchParams.get("flow");
      if (flowId !== null) {
        try {
          const flow = await kratosFetch.getLoginFlow({ id: flowId, cookie });

          if (flow.requested_aal === "aal1" || flow.requested_aal === "aal2") {
            return NextResponse.next(response);
          }
        } catch (err) {}
      }
    }

    await kratosFetch.toSession({ cookie });
    // If the user is authenticated and trying to access an auth route,
    // redirect them to the dashboard
    const redirectUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    // If the user is not authenticated, proceed to the auth route
    if (err instanceof ResponseError && err.response?.status === 401) {
      return NextResponse.next(response);
    }

    console.error(err);
  }
}

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;

  if (protectedRoutes.includes(pathname)) {
    return await handleProtectedRoutes(request, response);
  }

  if (authRoutes.includes(pathname)) {
    return await handleAuthRoutes(request, response);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all paths that should not be internationalized
    "/((?!_next|.*\\..*).*)",
  ],
};
