import { S3 } from 'aws-sdk';
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME } from '@config';

interface IUploadable {
    folder: string;
    key: string;
    type: string;
}

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
