import AWS from "aws-sdk";

const bucketName = "twitleague";
const region = "us-east-1";
const accessKey = "AKIAIYCNG4PDTZYKM4VA";
const secretAccessKey = "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";

const bucket = new AWS.S3({
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
    region: region
  });

export const uploadToS3 = (file, folder, callback) => {
    const fileName = file.name;
    const folderKey = encodeURIComponent(folder) + "/";
    const fileKey = folderKey + fileName;

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file,
      ContentType: file.type
    };
    
    return bucket.upload(params, function(err, data) {
 
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    }).promise();
  }