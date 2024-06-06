from .base import BaseSchema


class PublicMetadata(BaseSchema):
    stripe_customer_id: str


class Identity(BaseSchema):
    metadata_public: PublicMetadata
