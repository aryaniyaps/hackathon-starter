import { useMutation } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useRevokeSession() {
  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      return await kratos.disableMySession({ id: sessionId });
    },
  });
}
