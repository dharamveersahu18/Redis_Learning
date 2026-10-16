import Redis from'ioredis'
const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const STREAM_KEY = "notifications:stream";

async function consumeNotifications(){
  let lastId = "0-0";

  console.log("waiting for stream notifications...");

  while(true){
    try {
       const result =  await Redis.xread(
        "BLOCK", 0,
        "STREAMS",STREAM_KEY,lastId
       );

       if(!result) continue;

       for(const [, messages] of result){
        for(const [id,fields] of messages){
          const notification = {};

          for( let i=0; i< fields.length; i +=2){
            notification[fields[i]] = fields[i+1];
          }
          console.log("Received notification: ",{
            id,
            ...notification
          });
          lastId = id;
        }
       }

    } catch (error) {
      console.error("Consumer error:", error.message);
      await new Promise(resolve => setTimeout(resolve,1000));
      
    }
  }
  
}
consumeNotifications();