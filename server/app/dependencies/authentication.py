from http import HTTPStatus
from typing import Annotated

from fastapi import Header, HTTPException, Request
from ory_kratos_client.exceptions import ApiException
from ory_kratos_client.models import Session

from app.lib.kratos import kratos_client


async def auth_required(
    request: Request,
    cookie: Annotated[str | None, Header()] = None,
) -> None:
    """Check if the user is authorized."""
    if cookie is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Couldn't validate credentials.",
        )

    try:
        result = kratos_client.to_session(
            cookie=cookie,
            async_req=True,
        )

        session: Session = result.get()

        # set user ID on the request
        request.state.user_id = session.identity.id
    except ApiException as err:
        if err.status == HTTPStatus.UNAUTHORIZED:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Couldn't validate credentials.",
            ) from None
        raise
