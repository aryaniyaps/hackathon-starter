import { useMutation, useQueryClient } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useRevokeOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await kratos.disableMyOtherSessions();
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["/sessions"]})
      },
  });
}
