import { useMutation } from "@tanstack/react-query";
import ory from "../ory";

export default function useLogout() {
  return useMutation({
    mutationFn: async ({ rememberSession }: { rememberSession: boolean }) => {
      const logoutFlow = await ory.createBrowserLogoutFlow();

      return await fetch(logoutFlow.logout_url, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        redirect: "follow",
      });
    },
  });
}
