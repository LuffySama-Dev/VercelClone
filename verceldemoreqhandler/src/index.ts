import express from 'express';
import { S3 } from 'aws-sdk';

const s3 = new S3({
  accessKeyId: '',
  secretAccessKey: '',
  endpoint: '',
});

const app = express();

app.get('/*', async (req, res) => {
  const host = req.hostname;

  const id = host.split('.')[0];
  console.log(host);
  const filePath = req.path;
  console.log(filePath);

  const contents = await s3
    .getObject({
      Bucket: 'verceldemo',
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith('html')
    ? 'text/html'
    : filePath.endsWith('css')
    ? 'text/css'
    : 'application/javascript';

  res.set('Content-Type', type);
  res.send(contents.Body);
});

app.listen(3001);
