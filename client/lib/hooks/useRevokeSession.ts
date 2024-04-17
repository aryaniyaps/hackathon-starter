import { useMutation } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useRevokeSession() {
  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const { data } = await kratos.disableMySession({ id: sessionId });
      return data;
    },
  });
}
