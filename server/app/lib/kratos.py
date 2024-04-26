from ory_kratos_client import ApiClient, Configuration
from ory_kratos_client.apis import FrontendApi

kratos_client = FrontendApi(
    api_client=ApiClient(
        configuration=Configuration(
            host="",
        ),
    )
)
