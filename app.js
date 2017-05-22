var redis = require('redis'),
    os = require('os'),
    assert = require('assert')

var e = {
    client: null
};

function addToRedis(_path, _data) {
    try {
        e.client.ttl("set_" + _path, function(_error, _r){
            if (_error) {
                console.log(_error);
                process.exit(0);
            }
            setMagicKey(_path).then(() => {
                e.client.sadd("set_" + _path, _data);
                e.client.pexpire("set_" + _path, 2000)
            }, () => {});
            setTimeout(function () {
                addToRedis(_path, _data)
            }, 500);
        });
    } catch (_error) {
        console.log(_error);
    }
}

function setMagicKey(_key) {
    return new Promise((res, rej) => {
        e.client.hget("magicwords", _key, (_e, _d) => {
            if (_e) rej(_e)
            if (!_d) {
                e.client.hset("magicwords", _key, new Date().toISOString(), (_e, _d) => {
                    if (_e) rej(_e)
                    res()
                })
            } else res()
        })
    });
}

e.init = (_redisClient) => e.client = _redisClient;

e.register = (_path, _data) => {
    return new Promise((resolve, reject) => {
        if (!_path) reject('Missing config path.')
        if (!_data) reject('Missing config value')
        let ipAddress = process.env.PUTTU_IP ? process.env.PUTTU_IP : "localhost";
        let data = _data.protocol.toLowerCase() + '://' + ipAddress + ':' + _data.port + _data.api
        addToRedis(_path, data)
        resolve();
    })
}

e.get = (_path) => {
    var redisSet = "set_" + _path
    return new Promise((resolve, reject) => {
        e.client.srandmember(redisSet, (_e, _d) => {
            if (_e || !_d) {
                reject(_e)
            }
            resolve(_d)
        })
    })
}

e.getMagicKey = (_key) => {
    return new Promise((res, resj) => {
        e.client.hget("magicwords", _key, (_e, _d) => {
            if (_e) rej(_e)
            res(_d)
        })
    });
}

module.exports = e;