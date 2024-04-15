import { useMutation } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useRevokeOtherSessions() {
  return useMutation({
    mutationFn: async () => {
      return await kratos.disableMyOtherSessions();
    },
  });
}
