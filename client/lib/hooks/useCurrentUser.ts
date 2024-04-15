import { useSuspenseQuery } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useCurrentUser() {
  return useSuspenseQuery({
    queryKey: ["/users/@me"],
    queryFn: async () => {
      return await kratos.toSession();
    },
  });
}
