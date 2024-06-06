from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.customers import get_customer_service
from app.schemas.authentication import Identity, PublicMetadata
from app.schemas.customers import CreateStripeCustomerInput, CreateStripeCustomerResult
from app.services.customers import CustomerService

web_hook_router = APIRouter(
    prefix="/web_hooks",
)


@web_hook_router.post(
    "create_stripe_customer",
    response_model=CreateStripeCustomerResult,
    summary="Create a Stripe customer for the user.",
)
async def create_stripe_customer(
    data: CreateStripeCustomerInput,
    customer_service: Annotated[
        CustomerService,
        Depends(
            dependency=get_customer_service,
        ),
    ],
) -> CreateStripeCustomerResult:
    """Create a Stripe customer for the user."""
    customer = customer_service.create(
        email=data.traits.email,
        name=data.traits.name,
    )
    return CreateStripeCustomerResult(
        identity=Identity(
            metadata_public=PublicMetadata(
                stripe_customer_id=customer.id,
            ),
        ),
    )
