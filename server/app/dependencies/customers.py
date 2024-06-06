from app.services.customers import CustomerService


def get_customer_service() -> CustomerService:
    """Get the customer service."""
    return CustomerService()
