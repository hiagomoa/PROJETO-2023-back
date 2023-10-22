import { getType } from 'mime';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import { resolve } from 'path';
import { Readable } from 'stream';
import { tmpFolder } from '../../../config/upload';


export class S3StorageProvider  {
  private client: S3;
  constructor() {
    this.client = new S3({
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
      secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
      signatureVersion: 'v4',
    });
  }

  async save(file: string): Promise<string> {
    const fileOriginalName = resolve(`${tmpFolder}`, file);

    const fileContent = await fs.promises.readFile(fileOriginalName);

    const fileContentType = getType(fileOriginalName);

    const config : any = {
      Bucket: `${process.env.R2_BUCKET_NAME}`,
      Key: file,
      Body: fileContent,
      ContentType: fileContentType,
      ACL: 'public-read',
    };

    await this.client
      .putObject(config)
      .promise()
      .catch((error) => {
        console.debug(`Error to upload file ${error}`);
        return;
      });

    console.log('upload completed');
    try {
      await fs.promises.stat(fileOriginalName);
    } catch (error: any) {
      console.log(error.message)
      return file;
    }
    await fs.promises.unlink(fileOriginalName);

    return file
  }

  async delete(file: string): Promise<void> {

       await this.client
          .deleteObject({
            Bucket: `${process.env.R2_BUCKET_NAME}`,
            Key: file,
          })
          .promise()
          .catch((error) => {
            console.debug(`Error to delete file ${error}`);
            return;
          })
     
  }

  async getFile(fileName: string): Promise<Readable> {
    const BucketName = `${process.env.R2_BUCKET_NAME}`;
    const fileResult: Readable = this.client
      .getObject({
        Bucket: BucketName,
        Key: fileName,
      })
      .createReadStream()
      .on('error', (error) => {
        console.debug(`error to download file ${error.message}}`);
        return;
      });

    return fileResult;
  }
}
