import { useMutation } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useLogout() {
  return useMutation({
    mutationFn: async ({ rememberSession }: { rememberSession: boolean }) => {
      const logoutFlow = await kratos.createBrowserLogoutFlow();

      return await kratos.updateLogoutFlow({ token: logoutFlow.logout_token });
    },
  });
}
