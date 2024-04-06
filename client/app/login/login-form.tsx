"use client";
import { Flow } from "@/components/auth/flow";
import { LogoutLink } from "@/components/auth/logout-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
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
  aal: boolean;
  refresh: boolean;
  flow: LoginFlow;
}) {
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
      handleFlowError("login");
    }
  }

  return (
    <Card className="w-full items-center py-6 flex flex-col gap-6 ">
      <CardTitle>
        {(() => {
          if (flow?.refresh) {
            return "Confirm Action";
          } else if (flow?.requested_aal === "aal2") {
            return "Two-Factor Authentication";
          }
          return `Sign In to ${APP_NAME}`;
        })()}
      </CardTitle>
      <CardContent>
        <Flow onSubmit={onSubmit} flow={flow} />
      </CardContent>
      <CardFooter>
        {aal || refresh ? (
          <Button
            className="w-full"
            data-testid="logout-link"
            onClick={onLogout}
          >
            Log out
          </Button>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <Link href="/registration">Create account</Link>
            <Link href="/recovery">Recover your account</Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
