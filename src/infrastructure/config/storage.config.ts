import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  driver: process.env.STORAGE_DRIVER || 'minio',
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    useSSL: process.env.MINIO_USE_SSL === 'true',
    region: process.env.MINIO_REGION || 'us-east-1',
    publicBucket: process.env.MINIO_PUBLIC_BUCKET || 'public',
    privateBucket: process.env.MINIO_PRIVATE_BUCKET || 'private',
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    publicBucket: process.env.AWS_PUBLIC_BUCKET || 'public',
    privateBucket: process.env.AWS_PRIVATE_BUCKET || 'private',
  },
  publicUrl: process.env.FILE_STORAGE_PUBLIC_URL || 'http://localhost:9000',
}));
