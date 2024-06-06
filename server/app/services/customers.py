from stripe import Customer


class CustomerService:
    def __init__(self) -> None:
        pass

    def create(self, email: str, name: str) -> Customer:
        """Create a new Stripe customer."""
        return Customer.create(
            email=email,
            name=name,
        )
