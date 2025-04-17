// src/lib/s3.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET || 'homeschool-app-media';

/**
 * Upload a file to S3
 * @param file File to upload
 * @param key S3 object key (path)
 * @returns URL of the uploaded file
 */
export async function uploadToS3(file: File, key: string): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
    ACL: 'public-read' as ObjectCannedACL,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

/**
 * Delete a file from S3
 * @param key S3 object key (path)
 */
export async function deleteFromS3(key: string): Promise<void> {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}

/**
 * Generate a unique key for S3 object
 * @param fileName Original file name
 * @param userId User ID
 * @returns Unique S3 key
 */
export function generateS3Key(fileName: string, userId: string): string {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  return `uploads/${userId}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
}
