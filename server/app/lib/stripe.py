import stripe


def setup_stripe_client(api_key: str) -> None:
    """Set up the stripe client."""
    stripe.api_key = api_key
