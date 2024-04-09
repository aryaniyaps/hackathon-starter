"use client";
import { UserAuthCard } from "@/components/ory/user-auth-card";
import { handleError } from "@/lib/errors";
import ory from "@/lib/ory";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// TODO: submit forms serverside with nextjs actions, that would fix and
// standardize the error handling
export default function LoginForm({ flow }: { flow: LoginFlow }) {
  const router = useRouter();

  async function submitFlow(values: UpdateLoginFlowBody) {
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
    } catch (err) {
      if (err instanceof AxiosError) handleError(err, undefined, "/login");
    }
  }

  return (
    <UserAuthCard
      // This defines what kind of card we want to render.
      flowType={"login"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the login card should allow the user to go to the registration page and the recovery page
      additionalProps={{
        forgotPasswordURL: "/recovery",
        signupURL: "/registration",
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // we submit the form data to Ory
      onSubmit={async ({ body }) =>
        await submitFlow(body as UpdateLoginFlowBody)
      }
    />
  );
}
