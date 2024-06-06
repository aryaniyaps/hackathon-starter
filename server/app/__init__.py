from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse
from ratelimit import RateLimitMiddleware
from ratelimit.auths.ip import client_ip

from app.config import settings
from app.lib.constants import APP_NAME, SUPPORT_EMAIL
from app.lib.openapi import generate_operation_id
from app.lib.rate_limit import rate_limit_backend, rate_limit_config
from app.lib.stripe import setup_stripe_client
from app.routes.web_hooks import web_hook_router


def setup_third_party_clients() -> None:
    """Set up third party clients."""
    setup_stripe_client(
        api_key=settings.stripe_api_key,
    )


def add_routes(app: FastAPI) -> None:
    """Register routes for the app."""
    app.include_router(
        router=web_hook_router,
    )


def add_middleware(app: FastAPI) -> None:
    """Register middleware for the app."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_headers=["*"],
        allow_methods=["*"],
        expose_headers=["*"],
    )
    app.add_middleware(
        RateLimitMiddleware,
        authenticate=client_ip,
        backend=rate_limit_backend,
        config=rate_limit_config,
    )
    app.add_middleware(GZipMiddleware)
    app.add_middleware(
        CorrelationIdMiddleware,
        header_name="X-Request-ID",
    )


def create_app() -> FastAPI:
    """Initialize an app instance."""
    app = FastAPI(
        version="0.0.1",
        root_path=settings.root_path,
        debug=settings.debug,
        default_response_class=ORJSONResponse,
        openapi_url=settings.openapi_url,
        title=f"{APP_NAME} HTTP API",
        swagger_ui_parameters={
            "syntaxHighlight.theme": "monokai",
            "displayRequestDuration": True,
        },
        generate_unique_id_function=generate_operation_id,
        contact={
            "email": SUPPORT_EMAIL,
        },
    )
    setup_third_party_clients()
    add_routes(app)
    add_middleware(app)
    return app
