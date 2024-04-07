import { S3 } from 'aws-sdk';
import fs from 'fs';

const s3 = new S3({
  accessKeyId: '',
  secretAccessKey: '',
  endpoint: '',
});

export const uploadFile = async (
  uploadFilePath: string,
  localFilePath: string
) => {
  console.log('Upload Called!');
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: 'verceldemo',
      Key: uploadFilePath,
    })
    .promise();
  console.log(response);
};
