import { handleFlowError } from "@/lib/errors";
import kratos from "@/lib/kratos";
import { AxiosError } from "axios";
import { headers } from "next/headers";

export async function GET() {
  const cookie = headers().get("cookie") || "";
  try {
    const { data: logoutFlow } = await kratos.createBrowserLogoutFlow({
      cookie,
    });
    await kratos.updateLogoutFlow({ token: logoutFlow.logout_token, cookie });
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log("ERROR: ", err);
      handleFlowError(err, "login");
    }
  }

  // TODO: redirect here?
}
