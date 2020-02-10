const amqp = require('amqplib/callback_api');
const { fibonacci } = require('./fibonacchi');

amqp.connect('amqp://localhost', (err1, con) => {
  if (err1) {
    throw err1;
  }

  con.createChannel((err2, channel) => {
    if (err1) {
      throw err1;
    }

    const queue = 'rpc_queue';
    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log('Awaiting RPC request');

    channel.consume(queue, function reply(msg) {

      const n = parseInt(msg.content.toString());
      console.log(`Fibinacchi number: ${n}`);
      const res = fibonacci(n);
      
      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(res.toString()), {
        correlationId: msg.properties.correlationId
      });

      channel.ack(msg);
    });
  });
});