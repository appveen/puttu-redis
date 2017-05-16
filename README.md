# puttu-redis

Redis based micro-service registry

# Intro.

_puttu-redis_ is a [Redis](https://redis.io) based micro-service registry. Services can connect to this registry and register an endpoint by specifying a *service name*. Multiple instances of the same services can register different endpoints using the same *service name*. The library also retrieves a random endpoint from the list of endpoints registered under the same service name.

# Dependency

+ [node_redis](https://github.com/NodeRedis/node_redis)

# Usage