from typing import Annotated

from fastapi import Depends, Request
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
    OAuth2AuthorizationCodeBearer,
)

token_auth_scheme = HTTPBearer()

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="YOUR_ZITADEL_AUTHORIZATION_URL",
    tokenUrl="YOUR_ZITADEL_TOKEN_URL",
    scopes={"openid": "Access to OpenID Connect"},
)


async def auth_required(
    request: Request,
    token: Annotated[
        HTTPAuthorizationCredentials,
        Depends(
            dependency=token_auth_scheme,
        ),
    ],
) -> None:
    """Check if the user is authorized."""
