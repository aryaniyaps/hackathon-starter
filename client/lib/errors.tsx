import { AxiosError } from "axios";
import { redirect } from "next/navigation";

import { toast } from "@/components/ui/use-toast";

// A small function to help us deal with errors coming from fetching a flow.
export function handleFlowError<S>(
  flowType: "login" | "registration" | "settings" | "recovery" | "verification"
) {
  return async (err: AxiosError) => {
    switch (err.response?.data.error?.id) {
      case "session_inactive":
        redirect("/login?return_to=" + window.location.href);
      case "session_aal2_required":
        if (err.response?.data.redirect_browser_to) {
          const redirectTo = new URL(err.response?.data.redirect_browser_to);
          if (flowType === "settings") {
            redirectTo.searchParams.set("return_to", window.location.href);
          }
          // 2FA is enabled and enforced, but user did not perform 2fa yet!
          window.location.href = redirectTo.toString();
          return;
        }
        redirect("/login?aal=aal2&return_to=" + window.location.href);
      case "session_already_available":
        // User is already signed in, let's redirect them home!
        redirect("/");
      case "session_refresh_required":
        // We need to re-authenticate to perform this action
        window.location.href = err.response?.data.redirect_browser_to;
        return;
      case "self_service_flow_return_to_forbidden":
        // The flow expired, let's request a new one.
        toast({
          description: "The return_to address is not allowed.",
          variant: "destructive",
        });
        redirect("/" + flowType);
      case "self_service_flow_expired":
        // The flow expired, let's request a new one.
        toast({
          description:
            "Your interaction expired, please fill out the form again.",
          variant: "destructive",
        });
        redirect("/" + flowType);
      case "security_csrf_violation":
        // A CSRF violation occurred. Best to just refresh the flow!
        toast({
          description:
            "A security violation was detected, please fill out the form again.",
          variant: "destructive",
        });
        redirect("/" + flowType);
      case "security_identity_mismatch":
        // The requested item was intended for someone else. Let's request a new flow...
        redirect("/" + flowType);
      case "browser_location_change_required":
        // Ory Kratos asked us to point the user to this URL.
        window.location.href = err.response.data.redirect_browser_to;
        return;
    }

    switch (err.response?.status) {
      case 410:
        // The flow expired, let's request a new one.
        redirect("/" + flowType);
    }

    // We are not able to handle the error? Return it.
    return Promise.reject(err);
  };
}
