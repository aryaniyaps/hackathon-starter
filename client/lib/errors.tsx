import { AxiosError } from "axios";
import { redirect } from "next/navigation";

// FIXME: handle toasts properly

// A small function to help us deal with errors coming from fetching a flow.
export function handleFlowError<S>(
  err: AxiosError<S>,
  flowType: "login" | "registration" | "settings" | "recovery" | "verification"
): never {
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
        break;
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
      window.location.href = err.response.data.redirect_browser_to;
      break;
  }

  switch (err.response?.status) {
    case 410:
      // The flow expired, let's request a new one.
      redirect("/" + flowType);
  }

  // We are not able to handle the error? Throw it.
  throw err;
}

export const handleError = async (
  error: AxiosError<any, unknown>,
  getFlow:
    | ((flowId: string) => Promise<void | AxiosError>)
    | undefined = undefined,
  defaultNav: string | undefined = undefined
): Promise<AxiosError | void> => {
  if (!error.response || error.response?.status === 0) {
    window.location.href = `/error?error=${encodeURIComponent(
      JSON.stringify(error.response)
    )}`;
    return Promise.resolve();
  }

  const responseData = error.response?.data || {};

  switch (error.response?.status) {
    case 400: {
      if (responseData.error?.id == "session_already_available") {
        redirect("/");
      }

      break;
    }
    // we have no session or the session is invalid
    case 401: {
      console.warn("handleError hook 401: Navigate to /login");
      redirect("/login");
    }
    case 403: {
      // the user might have a session, but would require 2FA (Two-Factor Authentication)
      if (responseData.error?.id === "session_aal2_required") {
        redirect("/login?aal2=true");
      }

      if (
        responseData.error?.id === "session_refresh_required" &&
        responseData.redirect_browser_to
      ) {
        console.warn(
          "sdkError 403: Redirect browser to",
          responseData.redirect_browser_to
        );
        window.location = responseData.redirect_browser_to;
        return Promise.resolve();
      }
      break;
    }
    case 404: {
      console.warn("sdkError 404: Navigate to Error");
      const errorMsg = {
        data: error.response?.data || error,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: window.location.href,
      };

      redirect(`/error?error=${encodeURIComponent(JSON.stringify(errorMsg))}`);
    }
    // error.id handling
    //    "self_service_flow_expired"
    case 410: {
      if (getFlow !== undefined && responseData.use_flow_id !== undefined) {
        console.warn("sdkError 410: Update flow");
        return getFlow(responseData.use_flow_id).catch((error) => {
          // Something went seriously wrong - log and redirect to defaultNav if possible
          console.error(error);

          if (defaultNav !== undefined) {
            redirect(defaultNav);
          } else {
            // Rethrow error when can't navigate and let caller handle
            throw error;
          }
        });
      } else if (defaultNav !== undefined) {
        console.warn("sdkError 410: Navigate to", defaultNav);
        redirect(defaultNav);
      }
      break;
    }
    // we need to parse the response and follow the `redirect_browser_to` URL
    // this could be when the user needs to perform a 2FA challenge
    // or passwordless login
    case 422: {
      if (responseData.redirect_browser_to !== undefined) {
        const currentUrl = new URL(window.location.href);
        const redirectUrl = new URL(responseData.redirect_browser_to);

        // host name has changed, then change location
        if (currentUrl.host !== redirectUrl.host) {
          console.warn("sdkError 422: Host changed redirect");
          window.location = responseData.redirect_browser_to;
          return Promise.resolve();
        }

        // Path has changed
        if (currentUrl.pathname !== redirectUrl.pathname) {
          console.warn("sdkError 422: Update path");
          redirect(redirectUrl.pathname + redirectUrl.search);
        }

        // for webauthn we need to reload the flow
        const flowId = redirectUrl.searchParams.get("flow");

        if (flowId != null && getFlow !== undefined) {
          // get new flow data based on the flow id in the redirect url
          console.warn("sdkError 422: Update flow");
          return getFlow(flowId).catch((error) => {
            // Something went seriously wrong - log and redirect to defaultNav if possible
            console.error(error);

            if (defaultNav !== undefined) {
              redirect(defaultNav);
            } else {
              // Rethrow error when can't navigate and let caller handle
              throw error;
            }
          });
        } else {
          console.warn("sdkError 422: Redirect browser to");
          window.location = responseData.redirect_browser_to;
          return Promise.resolve();
        }
      }
    }
  }

  console.error(error);

  // if (fatalToError) {
  //   console.warn("sdkError: fatal error redirect to /error");
  //   redirect({
  //     pathname: "/error",
  //     query: {
  //       error: JSON.stringify(error, null, 2),
  //       id: error.response?.data.error?.id,
  //       flowType: Router.pathname,
  //     },
  //   });
  //   return Promise.resolve();
  // }

  throw error;
};
