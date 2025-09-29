const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { AppError } = require("../middleware/error");
const config = require('../config/config');

const s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey
    }
});

const uploadToS3 = async (file, filename) => {
    try {
        const key = `uploads/user-uploads/${filename}`;
        const params = {
            Bucket: config.aws.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return await getObjectURL(key);
    } catch (error) {
        console.error('S3 upload error:', error);
        throw error;
    }
};

const getObjectURL = async (key) => {
    try {
        const command = new GetObjectCommand({
            Bucket: config.aws.bucketName,
            Key: key,
        });
        return await getSignedUrl(s3Client, command);
    } catch (error) {
        console.error('S3 getObjectURL error:', error);
        throw error;
    }
};

module.exports = {
    uploadToS3,
    getObjectURL
};
