"use client";
import { env } from "@/lib/env";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SetupForm from "./setup-form";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function BillingForm() {
  // TODO: get CLIENT_SECRET from the server
  const options = {
    // passing the SetupIntent's client secret
    clientSecret: "{{CLIENT_SECRET}}",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };

  return (
    <Elements stripe={stripe} options={options}>
      <SetupForm />
    </Elements>
  );
}
