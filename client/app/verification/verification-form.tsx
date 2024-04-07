"use client";
import { UserAuthCard } from "@/components/ory/user-auth-card";
import ory from "@/lib/ory";
import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client";
import { useRouter } from "next/navigation";

export default function VerificationForm({ flow }: { flow: VerificationFlow }) {
  const router = useRouter();

  async function submitFlow(values: UpdateVerificationFlowBody) {
    try {
      await ory.updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      });
      if (flow?.return_to) {
        window.location.href = flow?.return_to;
        return;
      }
      router.push("/");
    } catch (err) {
      // handleError(err);
    }
  }

  return (
    <UserAuthCard
      // This defines what kind of card we want to render.
      flowType={"verification"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the verification card should allow the user to go to the registration page and the login page
      additionalProps={{
        signupURL: "/registration",
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // we submit the form data to Ory
      onSubmit={async ({ body }) =>
        await submitFlow(body as UpdateVerificationFlowBody)
      }
    />
  );
}
