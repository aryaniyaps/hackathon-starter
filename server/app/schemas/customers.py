from .authentication import Identity
from .base import BaseSchema


class CreateCustomerTraits(BaseSchema):
    email: str
    name: str


class CreateStripeCustomerInput(BaseSchema):
    user_id: str
    traits: CreateCustomerTraits


class CreateStripeCustomerResult(BaseSchema):
    identity: Identity
