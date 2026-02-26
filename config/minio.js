const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

// fungsi set public bucket
const setPublicBucket = async () => {
  const bucketName = "posts";

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };

  try {
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log("Bucket berhasil dijadikan PUBLIC");
  } catch (err) {
    console.log("Error set policy:", err);
  }
};

// jalankan sekali saat server start
setPublicBucket();

// 🔥 WAJIB ADA INI
module.exports = minioClient;