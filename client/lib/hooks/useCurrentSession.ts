import { useSuspenseQuery } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useCurrentSession() {
  return useSuspenseQuery({
    queryKey: ["/sessions/@me"],
    queryFn: async () => {
      try {
        return await kratos.toSession();
      } catch (err) {
        console.log("ERRORRRRRRRR");
        console.error(err);
        throw err;
      }
    },
  });
}
