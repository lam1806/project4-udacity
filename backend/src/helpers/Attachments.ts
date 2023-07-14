import * as AWS from 'aws-sdk'
import {Types} from "aws-sdk/clients/s3"

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
export class Attachment {
    private readonly expires: number = parseInt(process.env.SIGNED_URL_EXPIRATION);
    private readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET_VALUE;
    private s3: Types;

    constructor() {
        this.s3 = new XAWS.S3({ signatureVersion: 'v4' });
    }

    public async createAttachmentUrl(attachmentId: string): Promise<string> {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,    
            Key: attachmentId,
            Expires: this.expires
        }) as string;
    }
}