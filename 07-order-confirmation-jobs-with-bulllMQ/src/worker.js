import { Worker } from "bullmq";
import {connection} from './queue.js'


const emailWorker = new Worker(
  'email',
  async(Job)=>{
    console.log("Processing email job..",Job.id, JSON.name, Job.data);
  await new Promise((resolve) => setTimeout(resolve,1500));
  console.log("Email job completed!", Job.id, JSON.name, Job.data)
  },
  {connection}

)

Worker.on("completed",(Job)=>{
  console.log("Job completed!",Job.id, JSON.name, Job.data)
});

Worker.on("failed",(Job,err)=>{
  console.log("Job failed!",Job.id, JSON.name, Job.data,err)
});