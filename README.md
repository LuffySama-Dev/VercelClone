# How things work at Backend in Vercel ?

## Intro:

Hi Folks, this project is an effort to replicate backend functionality of the Vercel. Building thid project was possible due to help of video by Harkirat so speacial thanks to him.

## Tech stack used

- Node JS
- Redis-CLI
- Redis-DB
- Redis-R2 bucket (Opensource alternative of S3 bucket)
- Redis Queue manager (Opensource alternative of SQS)
- Express JS
- TypeScript

## How are things working in it ?

- Code is divided into three parts:

  1. Upload Service:
     This service will take url to git repo from user via front end and then it will clone it locally using SimpleGit package. It will then iterate through the cloned files and upload them one by one to Redis R2 bucket and generate a random UUID for user to track the status. A task will be pushed into Redis Queue manager which is being monitored by next service.

  2. Deploy Service:
     This service is monitoring the redis queue and will pop the task once it is added by upload service. Then this server will download the code, install all dependencies and build it locally. It will then take the built files from the destination folder and then upload them back to R2 Bucket. Yes, the R2 bucket will contain both the repo and the built code. It will then finally update the status to deployed for the user in Redis-DB.

  3. Request Handler Service:
     This service will help to manage the users request. Whenever user wants to visit their website they can hit the provided url and this service will pick up the request and get the deployed website (i.e html & css files) from R2 bucket thus making it available to user.

## Conclusion:

Knowing how things work at backend of vercel was pretty intresting. Once I understood how simple it was to build the skeleton for the backend, ideas on how to make it better and how it can be optimized in terms of space and time started showing up.
Never thought it was so easy to get started. Hoping to explore more such projects. Also, special thanks to Harkirat.
