import { useMutation, useQueryClient } from "@tanstack/react-query";
import kratos from "../kratos";

// TODO: update query cache here
export default function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const { data } = await kratos.disableMySession({ id: sessionId });
      return data;
    },
    onSuccess: async (data, {sessionId}) => {
    
    queryClient.setQueryData(['/sessions'], (data) => {
      console.log("OLD DATA: ", data);
      if (data) {
        const newPagesArray =
        data.pages.map((page) =>
          page.sessions.filter((session) => session.id !== sessionId),
        ) ?? [];
  
        return {
          ...data,
          pages: newPagesArray,
      };
      }

      return data;

      });
    },
  });
}
