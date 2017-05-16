var redis = require("redis");
var puttu = require('./app.js')

var client = redis.createClient();

client.on("error", function (err) {
  console.log('Redis Disconnected, stopping service')
  process.exit(0)
})

puttu.init(client);

var master = "product"
puttu.register(master, {
    protocol: 'http',
    port: '10001',
    api: '/product/v1'
}).then(
    () => {
        console.log('Registered self')
        puttu.get("set_" + master).then(
            d => console.log(d),
            e => console.log(e)
        );
        puttu.getMagicKey(master).then(
            d => console.log(d),
            e => console.log(e)
        )
    },
    e => console.log(e)
);
