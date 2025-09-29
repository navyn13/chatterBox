const config = {
    mongodb: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/streamvista'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiry: '24h'
    },
    aws: {
        region: process.env.AWS_REGION,
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_KEY,
        bucketName: process.env.AWS_BUCKET_NAME
    },
    cors: {
        origin: [process.env.CLIENT_URL],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        credentials: true
    },
    server: {
        port: process.env.PORT || 4000
    }
};

module.exports = config;
