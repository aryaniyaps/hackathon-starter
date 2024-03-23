from http import HTTPMethod

from ratelimit import Rule
from ratelimit.backends.redis import RedisBackend
from redis.asyncio import StrictRedis

from app.config import settings

rate_limit_backend = RedisBackend(
    StrictRedis.from_url(
        url=str(settings.redis_url),
    ),
)


rate_limit_config = {
    r"/users/@me": [
        Rule(
            method=HTTPMethod.GET,
            hour=1000,
            group="default",
        ),
        Rule(
            method=HTTPMethod.PATCH,
            hour=500,
            group="default",
        ),
    ],
}
