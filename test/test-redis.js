
async function test() {
    const Redis = require('ioredis');

    const redis = new Redis({
        port: 6378,
        password: 123456
    })


    // 数据库是异步的
    await redis.setex('c', 10 ,123)
    const keys = await redis.keys('*')
    // console.log(await redis.get('a'), keys)
}

test()