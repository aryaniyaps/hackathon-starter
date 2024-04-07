"use client";
import { UserAuthCard } from "@/components/ory/user-auth-card";
import ory from "@/lib/ory";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { useRouter } from "next/navigation";

export default function LoginForm({ flow }: { flow: LoginFlow }) {
  const router = useRouter();

  const submitFlow = (values: UpdateLoginFlowBody) =>
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
      .catch(handleError);

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
      onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
    />
  );
}
