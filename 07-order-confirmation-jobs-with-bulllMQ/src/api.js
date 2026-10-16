
import { Backoffs } from "bullmq";
import express from express
import {emailQueue} from "./queue.js";
const app= express()

app.use(express.json());


app.post("/welcome-email",async(Request,res)=>{
const job = emailQueue.add(
  "send -welcome-email",
  {
    to: req.body.to,
    name: req.body.name || Leaner
  },
  {
    attemps: 3,
    Backoffs:{
      type:"expnential",
      delay:1000,
    }
  }
)
res.json({message: "Welcome email job added to the queue!",jobId:job.id});
})


app.listen(3000,()=>{
  console.log('Server is running on port http://localhost:3000');
  
})