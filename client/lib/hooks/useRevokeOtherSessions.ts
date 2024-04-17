import { useMutation } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useRevokeOtherSessions() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await kratos.disableMyOtherSessions();
      return data;
    },
  });
}
