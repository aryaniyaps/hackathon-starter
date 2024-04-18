import { useMutation, useQueryClient } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const { data } = await kratos.disableMySession({ id: sessionId });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["/sessions"]})
    }
  });
}
