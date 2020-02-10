const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, con) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Successfully conncected...');
  }
  con.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    const queue = 'task_queue';
    const msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});