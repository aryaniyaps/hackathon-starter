"use client";
import { Flow } from "@/components/auth/flow";
import { LogoutLink } from "@/components/auth/logout-link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm({
  aal,
  refresh,
  flow,
}: {
  aal: string;
  refresh: string;
  flow: LoginFlow;
}) {
  const { toast } = useToast();

  const router = useRouter();

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh]);

  async function onSubmit(values: UpdateLoginFlowBody) {
    // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    // his data when she/he reloads the page.
    router.push(`/login?flow=${flow?.id}`, { scroll: false });

    try {
      await ory.updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      });

      if (flow?.return_to) {
        window.location.href = flow?.return_to;
        return;
      }
      router.push("/");
      // We logged in successfully! Let's bring the user home.
    } catch (err) {
      handleFlowError("login", toast);
    }
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
