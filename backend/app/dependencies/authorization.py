from http import HTTPStatus
from typing import Annotated

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.lib.oauth2.token_validator import (
    ValidatorError,
    ZitadelIntrospectTokenValidator,
)

token_auth_scheme = HTTPBearer()

validator = ZitadelIntrospectTokenValidator()


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
    validator.validate_request(request)
    auth_token = validator.authenticate_token(token.credentials)

    try:
        validator.validate_token(
            token=auth_token,
            scopes=auth_token.get("scope"),
            request=request,
        )
    except ValidatorError as err:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=err.error,
        ) from err
