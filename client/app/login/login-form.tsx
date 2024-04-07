"use client";
import Flow from "@/components/auth/flow";
import { LogoutLink } from "@/components/auth/logout-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { handleFlowError } from "@/lib/errors";
import ory from "@/lib/ory";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
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
      if (err instanceof AxiosError) handleFlowError(err, "login");
    }
  }

  return (
    <Card className="w-full items-center py-6 px-4 flex flex-col">
      <CardHeader className="flex flex-col items-center">
        {flow.refresh ? (
          <>
            <CardTitle>Confirm Action</CardTitle>
            <CardDescription>
              We need to confirm your identity before proceeding
            </CardDescription>
          </>
        ) : flow.requested_aal === "aal2" ? (
          <>
            <CardTitle>Two Factor Authentication</CardTitle>
            <CardDescription>
              We need verification from one more factor
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle>{`Sign In to ${APP_NAME}`}</CardTitle>
            <CardDescription>It&apos;s good to see you again!</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="w-full">
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
            <Link href="/registration" className="text-primary">
              Create account
            </Link>
            <Link href="/recovery" className="text-primary">
              Recover your account
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
