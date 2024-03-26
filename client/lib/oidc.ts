import { env } from "./env";

export async function refreshTokenRequest(refresh_token: string) {
  return await fetch(`${env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.KEYCLOAK_CLIENT_ID,
      client_secret: env.KEYCLOAK_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    method: "POST",
    cache: "no-store",
  });
}
