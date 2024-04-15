import { useSuspenseQuery } from "@tanstack/react-query";
import ory from "../ory";

export default function useCurrentUser() {
  return useSuspenseQuery({
    queryKey: ["/users/@me"],
    queryFn: async () => {
      return await ory.toSession();
    },
  });
}
