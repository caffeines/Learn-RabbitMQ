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
    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, msg => {
      const secs = msg.content.toString().split('.').length - 1;
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
      }, secs * 1000);
    }, {noAck: false });
  });
});