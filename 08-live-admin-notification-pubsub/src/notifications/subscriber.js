import Redis from'ioredis'
const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

subscriber.subscribe('notification',(err)=>{
  if(err){
    console.error('Failed to subscribe ',err.message);
    return
  }  
  console.log('subscribed successfully');
  
});

subscriber.on('message',(channel,message)=>{
  try {
    const notification= JSON.parse(message);

    console.log("Received on", channel);
    console.log("Notification:",notification);    
  } catch (error) {
    console.error("Invalid notification JSON:", error.message);
    
  }
})

