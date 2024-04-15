import { useSuspenseQuery } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useSessions() {
  return useSuspenseQuery({
    queryKey: ["/auth/sessions"],
    queryFn: async ({ pageParam }) => {
      return await kratos.listMySessions({ pageSize: 20 });
    },
  });
}
