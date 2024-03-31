import { Session } from "next-auth";
import { useRouter } from "next/router";
import { QueryOptions, useQuery } from "react-query";

async function fetchSession(): Promise<Session | null> {
  const res = await fetch("/api/auth/session");
  const session = res.json();
  if (Object.keys(session).length) {
    return session;
  }
  return null;
}

/**
 * React Query wrapper to retrieve `Session`.
 * Replaces `useSession` and `Provider` from `next-auth/client` in codebases
 * where you already use `react-query`.
 *
 * [`useSession`](https://next-auth.js.org/getting-started/client#usesession) |
 * [`Provider`](https://next-auth.js.org/getting-started/client#provider) |
 * [React Query](https://react-query.tanstack.com/guides/ssr#using-nextjs)
 */
export default function useSession<R extends boolean = false>({
  required,
  redirectTo = "/api/auth/signin?error=SessionExpired",
  queryConfig,
}: {
  /** If set to `true`, the returned session is guaranteed to not be `null` */
  required?: R;
  /** If `required: true`, the user will be redirected to this URL, if they don't have a session */
  redirectTo?: string;
  queryConfig?: QueryOptions<Session | null>;
} = {}) {
  const router = useRouter();
  const query = useQuery(["session"], fetchSession, {
    onSettled(data) {
      if (data || !required) return;
      router.push(redirectTo);
    },
    ...queryConfig,
  });
  return [
    query.data as R extends true ? Session : Session | null,
    query.status === "loading",
  ] as const;
}
