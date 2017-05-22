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
    port: '10002',
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
