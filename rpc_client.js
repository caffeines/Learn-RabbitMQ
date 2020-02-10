const amqp = require('amqplib/callback_api');

const generateUuid = () => {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}

const args = process.argv.slice(2);

amqp.connect('amqp://localhost', (err1, con) => {
  if (err1) {
    throw err1;
  }
  con.createChannel((err2, channel) => {
    if (err2) {
      throw err2;
    }

    channel.assertQueue('', {
      exclusive: true,
    }, (err3, q) => {

      if (err3) {
        throw err3;
      }

      const correlationId = generateUuid();
      const num = parseInt(args[0]);
      console.log('Requesting fib(%d)', num);

      channel.consume(q.queue, (msg) => {
        if (msg.properties.correlationId == correlationId) {
          console.log('Got %s', msg.content.toString());
          /* setTimeout(() => {
            connection.close();
            process.exit(0)
          }, 500); */
        }
      }, {
        noAck: true,
      });
      channel.sendToQueue('rpc_queue',
      Buffer.from(num.toString()), {
      correlationId: correlationId,
      replyTo: q.queue
    });
    });
  });
});