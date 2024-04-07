import { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const s3 = new S3({
  accessKeyId: '',
  secretAccessKey: '',
  endpoint: '',
});

export async function downloadsS3Folder(prefix: string) {
  const allFiles = await s3
    .listObjectsV2({
      Bucket: 'verceldemo',
      Prefix: prefix,
    })
    .promise();

  const allPromises =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise(async (resolve) => {
        if (!Key) {
          resolve('');
          return;
        }
        const finalOutputPath = path.join(__dirname, Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }
        s3.getObject({
          Bucket: 'verceldemo',
          Key,
        })
          .createReadStream()
          .pipe(outputFile)
          .on('finish', () => {
            resolve('');
          });
      });
    }) || [];
  console.log('awaiting...');
  await Promise.all(allPromises?.filter((x) => x !== undefined));
}

export function copyFinalDist(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/dist`);
  const allFiles = getAllFiles(folderPath);
  allFiles.forEach((file) => {
    uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
  });
}

export const getAllFiles = (folderPath: string) => {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
    console.log(fullFilePath);
  });
  return response;
};

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
