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

    const queue = 'hello';

    channel.assertQueue(queue, { durable: false });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, msg => {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true });
  });
});