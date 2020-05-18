import { S3 } from 'aws-sdk';

interface IUploadable {
    folder: string;
    key: string;
    type: string;
}

const AWS_ACCESS_KEY = 'blank';
const AWS_SECRET_KEY = 'blank';
const AWS_BUCKET_NAME = 'blank';

export const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    signatureVersion: 'v4',
    region: 'eu-west-3',
});

export const uploader = async (params: IUploadable) => {
    const { folder, key, type } = params;

    const url = await s3.getSignedUrlPromise('putObject', {
        Bucket: AWS_BUCKET_NAME,
        ContentType: type,
        Key: `${folder}/${key}.${type.match(/image\/(.+)/)[1]}`,
    });
    return url;
};
