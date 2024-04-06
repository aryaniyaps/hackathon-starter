"use client";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Flow } from "@/components/auth/flow";
import { LogoutLink } from "@/components/auth/logout-link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";

export default function LoginPage() {
  const [flow, setFlow] = useState<LoginFlow>();

  const { toast } = useToast();

  // Get ?flow=... from the URL
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = searchParams.get("return_to");

  const flowId = searchParams.get("flow");

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = searchParams.get("refresh");

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = searchParams.get("all");

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh]);

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "login", setFlow, toast));
      return;
    }

    // Otherwise we initialize it
    ory
      .createBrowserLoginFlow({
        refresh: Boolean(refresh),
        aal: aal ? String(aal) : undefined,
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "login", setFlow, toast));
  }, [flowId, router, aal, refresh, returnTo, flow]);

  async function onSubmit(values: UpdateLoginFlowBody) {
    // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    // his data when she/he reloads the page.
    router.push(`/login?flow=${flow?.id}`, { scroll: false });

    ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        if (flow?.return_to) {
          window.location.href = flow?.return_to;
          return;
        }
        router.push("/");
      })
      .then(() => {})
      .catch(handleFlowError(router, "login", setFlow, toast))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data);
          return;
        }

        return Promise.reject(err);
      });
  }

  return (
    <>
      <Card>
        <CardTitle>
          {(() => {
            if (flow?.refresh) {
              return "Confirm Action";
            } else if (flow?.requested_aal === "aal2") {
              return "Two-Factor Authentication";
            }
            return "Sign In";
          })()}
        </CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </Card>
      {aal || refresh ? (
        <Card>
          <CardContent data-testid="logout-link" onClick={onLogout}>
            Log out
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <Link href="/registration" passHref>
              <CardContent>Create account</CardContent>
            </Link>
          </Card>
          <Card>
            <Link href="/recovery" passHref>
              <CardContent>Recover your account</CardContent>
            </Link>
          </Card>
        </>
      )}
    </>
  );
}
