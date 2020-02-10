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
    const msg = "Hello RabbitMQ";

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);

    setTimeout(function() { 
      connection.close(); 
      process.exit(0) 
      }, 500);
  });
});