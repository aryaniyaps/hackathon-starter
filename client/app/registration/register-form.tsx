"use client";
import { UserAuthCard } from "@/components/ory/user-auth-card";
import ory from "@/lib/ory";
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client";
import { useRouter } from "next/navigation";

export default function RegisterForm({ flow }: { flow: RegistrationFlow }) {
  const router = useRouter();

  const submitFlow = (values: UpdateRegistrationFlowBody) =>
    ory
      .updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
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
      flowType={"registration"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the registration card needs a way to navigate to the login page
      additionalProps={{
        loginURL: "/login",
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // submit the registration form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateRegistrationFlowBody)}
    />
  );
}
