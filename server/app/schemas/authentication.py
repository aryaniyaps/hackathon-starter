from .base import BaseSchema


class IdentityTraits(BaseSchema):
    email: str
    name: str
    customer_id: str


class Identity(BaseSchema):
    traits: IdentityTraits
