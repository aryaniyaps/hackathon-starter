from fastapi import APIRouter

from app.schemas.customers import CreateStripeCustomerInput

web_hook_router = APIRouter(
    prefix="/web_hooks",
)


@web_hook_router.post("create_stripe_customer")
async def create_stripe_customer(_data: CreateStripeCustomerInput) -> None:
    """Create a Stripe customer for the user."""
