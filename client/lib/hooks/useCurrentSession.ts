import { useSuspenseQuery } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useCurrentSession() {
  return useSuspenseQuery({
    queryKey: ["/sessions/@me"],
    queryFn: async () => {
      return await kratos.toSession();
    },
  });
}
