const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let count = 0;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    count++
    // ws.send('[message from server]');
    if(count <= 5) {
      setTimeout(() => {
        ws.send('[message from server]');
      }, 2000) 
    }
  });

  ws.on('close', function () {
    console.log('server close')
  })

  ws.send('connected');
});

var router = new Router();

router.get('/chat', (ctx, next) => {
  console.log('is chat')
  ctx.body = 'chat';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('server is listented on http://localhost:' + 3000)
});