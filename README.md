# puttu-redis
Redis based micro-service registry

![build](https://travis-ci.org/capiotsoftware/puttu-redis.svg?branch=master)

_puttu-redis_ is a [Redis](https://redis.io) based micro-service registry. This enables services to connect and register an endpoint by specifying a *service name*. Multiple instances of the same services can register different endpoints using the same *service name*. The library also retrieves a random endpoint from the list of endpoints registered under the same service name.

The library also creates a unique magic key for each of the service that gets registered. The magic key can be used as a simple authentication mechanism while making cross-service calls.

## Dependency

+ [node_redis](https://github.com/NodeRedis/node_redis)

## APIs

### init()

`init()` initialized the library. Redis client must be passed as an argument.

**Usage**

```javascript
var client = redis.createClient();
puttu.init(client);
```

### register(_serviceName_, _options_)

`register()` registers the service. This takes in 2 paramenters, 

+ _serviceName_: Name of the service under which the endpoint must be registered.
+ _options_: The _options_ object takes 3 mandatory values,
	+ _protocol_: The protocol being used by the service.
	+ _port_: The port on which the service is listening
	+ _api_: The API endpoint where the service can be accessed.

```javascript
var serviceName = "product";
var options = {
    protocol: 'http',
    port: '8081',
    api: '/product/v1'
};
puttu.register(serviceName, options);
```

What's missing here is the IP address at which the service is running. By default the library assumes that the service is running on `localhost`. If you wish to override the default value, and you will have to override this value in production, you can specify the IP address by setting the environment varriable **PUTTU_IP**

### get(_serviceName_)

`get()` takes service name as a parameter and returns one of the endpoints that has been registered under the service name.

```javascript
var serviceName = "product";
puttu.get(serviceName);
```

This will return `http://localhost:10001/product/v1` (based on the `register()` example given above).

If you set the environment variable PUTTU_IP, say 10.1.1.12, then the result would be `http://10.1.1.12:10001/product/v1`


### getMagicKey(_serviceName_)

`getMagicKey()` takes service name as a parameter and returns the generated magic key for that service.

## Example

```javascript
var redis = require("redis");
var puttu = require('./app.js')

var client = redis.createClient();

client.on("error", function (err) {
  console.log('Redis Disconnected, stopping service')
  process.exit(0)
})

puttu.init(client);

var serviceName = "product"
var options = {
    protocol: 'http',
    port: '10001',
    api: '/product/v1'
};
puttu.register(serviceName, options).then(
    () => {
        console.log('Registered self')
        puttu.get(serviceName).then(
            d => console.log(d),
            e => console.log(e)
        );
        puttu.getMagicKey(serviceName).then(
            d => console.log(d),
            e => console.log(e)
        )
    },
    e => console.log(e)
);
```

