const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) {
    throw err0;
  }
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    const exchange = 'logs';
    const msg = process.argv.slice(2).join(' ') || 'Hello World!';
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });
    
    channel.assertQueue('', {
      exclusive: true,
    }, (err2, q) => {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');
      channel.publish(exchange, '', Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
      channel.consume(q.queue, function (msg) {
        if (msg.content) {
          console.log(" [x] %s", msg.content.toString());
        }
      }, {
        noAck: true
      });
    });
  });
});