import { handleFlowError } from "@/lib/errors";
import kratos from "@/lib/kratos";
import { AxiosError } from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  const cookie = headers().get("cookie") || "";
  try {
    const { data: logoutFlow } = await kratos.createBrowserLogoutFlow({
      cookie,
    });
    await kratos.updateLogoutFlow({ token: logoutFlow.logout_token, cookie });
  } catch (err) {
    if (err instanceof AxiosError) {
      handleFlowError(err, "login");
    }
  }

  redirect("/login");
}
