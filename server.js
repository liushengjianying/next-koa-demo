const Koa = require("koa");
const Router = require("koa-router");
const next = require("next");
const session = require("koa-session");
const Redis = require("ioredis");
const auth = require("./server/auth");

const RedisSessionStore = require("./server/session-store");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// 创建redis的client
const redis = new Redis();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.keys = ["Aoch develop"];
  const SESSION_CONFIG = {
    key: "jid",  
    store: new RedisSessionStore(redis)
  };

  server.use(session(SESSION_CONFIG, server));
  // 这行代码的逻辑类似于
  // server.use(async(ctx, next) => {
  //   if (ctx.cookies.get('jid')) {
  //     ctx.session = ''
  //   }
  //   await next()
  // 调用完中间件以后，对比session的值，并且返回新的cookie
  //   ctx.session
  //   ctx.cookies.set()
  // })

  // 配置处理github OAuth 登录
  auth(server)

  router.get("/a/:id", async ctx => {
    const id = ctx.params.id;
    await handle(ctx.req, ctx.res, {
      pathname: "/a",
      query: { id }
    });
    ctx.respond = false;
  });

  router.get("/api/user/info", async ctx => {
    // const id = ctx.params.id;
    // await handle(ctx.req, ctx.res, {
    //   pathname: "/a",
    //   query: { id }
    // });
    // ctx.respond = false;
    const user = ctx.session.userInfo;
    if (!user) {
      ctx.status = 401
      ctx.body = 'Need Login'
    } else {
      ctx.body = user
      // 设置header
      ctx.set('Content-Type', 'application/json')
    }
  });

  server.use(router.routes());

  server.use(async ctx => {
    // ctx.cookies.set("id", "user:xxxx");
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.listen(3000, () => {
    console.log("listen to port 3000");
  });
});
