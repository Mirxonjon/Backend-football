import { v4 } from 'uuid';
import { Storage } from '@google-cloud/storage';
import { extname, join, resolve } from 'path';

const projectId = 'footballprojectinuzb';
const keyFilename = resolve(process.cwd(), 'src', 'utils', 'key.json');
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket('footballprojectinuzb');

export const googleCloud = (file: any | any[]) => {
  const a: any[] = [];
  a.push(file);
  const imageLink = join(v4() + extname(a[0]?.originalname));
  const blob = bucket.file(imageLink);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    console.log(err);
  });

  blobStream.end(a[0]?.buffer);
  return imageLink;
};
