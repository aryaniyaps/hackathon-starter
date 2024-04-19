import { AxiosError } from "axios";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

// A small function to help us deal with errors coming from fetching a flow.
// this is used in client-side pages
export function handleClientSideFlowError<S>(
  router: ReturnType<typeof useRouter>,
  flowType: "login" | "registration" | "settings" | "recovery" | "verification",
  resetFlow: Dispatch<SetStateAction<S | undefined>>
) {
  return async (err: unknown) => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as any;
      console.log("DATA: ", data);
      switch (data.error?.id) {
        case "session_inactive":
          router.push("/login?return_to=" + window.location.href);
          return;
        case "session_aal2_required":
          if (data.redirect_browser_to) {
            const redirectTo = new URL(data.redirect_browser_to);
            if (flowType === "settings") {
              redirectTo.searchParams.set("return_to", window.location.href);
            }
            // 2FA is enabled and enforced, but user did not perform 2fa yet!
            window.location.href = redirectTo.toString();
            return;
          }
          router.push("/login?aal=aal2&return_to=" + window.location.href);
          return;
        case "session_already_available":
          // User is already signed in, let's redirect them home!
          router.push("/");
          return;
        case "session_refresh_required":
          // We need to re-authenticate to perform this action
          window.location.href = data.redirect_browser_to;
          return;
        case "self_service_flow_return_to_forbidden":
          // The flow expired, let's request a new one.
          toast.error("The return_to address is not allowed.");
          resetFlow(undefined);
          router.push("/" + flowType);
          return;
        case "self_service_flow_expired":
          // The flow expired, let's request a new one.
          toast.error(
            "Your interaction expired, please fill out the form again."
          );
          resetFlow(undefined);
          router.push("/" + flowType);
          return;
        case "security_csrf_violation":
          // A CSRF violation occurred. Best to just refresh the flow!
          toast.error(
            "A security violation was detected, please fill out the form again."
          );
          resetFlow(undefined);
          router.push("/" + flowType);
          return;
        case "security_identity_mismatch":
          // The requested item was intended for someone else. Let's request a new flow...
          resetFlow(undefined);
          router.push("/" + flowType);
          return;
        case "browser_location_change_required":
          // Ory Kratos asked us to point the user to this URL.
          window.location.href = data.redirect_browser_to;
          return;
      }

      switch (err.response?.status) {
        case 410:
          // The flow expired, let's request a new one.
          resetFlow(undefined);
          router.push("/" + flowType);
          return;
      }
    }

    // We are not able to handle the error? Return it.
    return Promise.reject(err);
  };
}

// A small function to help us deal with errors coming from fetching a flow.
// this is used in server-side pages
export function handleFlowError<S>(
  err: AxiosError,
  flowType: "login" | "registration" | "settings" | "recovery" | "verification"
): Promise<never> {
  const data = err.response?.data as any;
  switch (data.error?.id) {
    case "session_inactive":
      redirect("/login?return_to=" + window.location.href);
    case "session_aal2_required":
      if (data.redirect_browser_to) {
        const redirectTo = new URL(data.redirect_browser_to);
        if (flowType === "settings") {
          redirectTo.searchParams.set("return_to", window.location.href);
        }
        // 2FA is enabled and enforced, but user did not perform 2fa yet!
        window.location.href = redirectTo.toString();
        break;
      }
      redirect("/login?aal=aal2&return_to=" + window.location.href);
    case "session_already_available":
      // User is already signed in, let's redirect them home!
      redirect("/");
    case "session_refresh_required":
      // We need to re-authenticate to perform this action
      window.location.href = data.redirect_browser_to;
      break;
    case "self_service_flow_return_to_forbidden":
      // The flow expired, let's request a new one.
      // toast.error("The return_to address is not allowed.");
      redirect("/" + flowType);
    case "self_service_flow_expired":
      // The flow expired, let's request a new one.
      // toast.error("Your interaction expired, please fill out the form again.");
      redirect("/" + flowType);
    case "security_csrf_violation":
      // A CSRF violation occurred. Best to just refresh the flow!
      // toast.error(
      //   "A security violation was detected, please fill out the form again."
      // );
      redirect("/" + flowType);
    case "security_identity_mismatch":
      // The requested item was intended for someone else. Let's request a new flow...
      redirect("/" + flowType);
    case "browser_location_change_required":
      // Ory Kratos asked us to point the user to this URL.
      window.location.href = data.redirect_browser_to;
      break;
  }
  switch (err.status) {
    case 410:
      // The flow expired, let's request a new one.
      redirect("/" + flowType);
    case 404:
      // The flow was not found, let's request a new one.
      redirect("/" + flowType);
  }

  // We are not able to handle the error? Throw it.
  throw err;
}
