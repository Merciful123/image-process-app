// import sharp from "sharp";
// import exifParser from "exif-parser";
// import { exec } from "child_process";
// import fs from "fs";
// import { promisify } from "util";
// import CloudmersiveImageApiClient from "cloudmersive-image-api-client";

// const execPromise = promisify(exec);

// export async function processImage(buffer) {
//   try {
//     //

//     // // var CloudmersiveImageApiClient = require("cloudmersive-image-api-client");
//     // var defaultClient = CloudmersiveImageApiClient.ApiClient.instance;

//     // // Configure API key authorization: Apikey
//     // // var Apikey = defaultClient.authentications["Apikey"];
//     // var Apikey = defaultClient.authentications["Apikey"];
    
//     // // Apikey.apiKey = "YOUR API KEY";
//     // Apikey.apiKey = "2a719f14-cf82-4564-9577-c747c3dea632";

//     // var apiInstance = new CloudmersiveImageApiClient.ConvertApi();

//     // var imageFile = Buffer.from(fs.readFileSync(buffer).buffer); // File | Image file to perform the operation on.  Common file formats such as PNG, JPEG are supported.

//     // var callback = function (error, data, response) {
//     //   if (error) {
//     //     console.error("error",error);
//     //   } else {
//     //     console.log("API called successfully. Returned data: " + data);
//     //   }
//     // };
//     // apiInstance.convertToPng(imageFile, callback);

//     //
//     const processedImageBuffer = await sharp(buffer).toFormat("jpeg").jpeg({
//       force: true,
//     });

//     return processedImageBuffer;
//   } catch (error) {
//     // Handle the case where the image format is not supported
//     console.error("Unsupported image format:", error.message);
//     throw new Error("Unsupported image format");
//   }
// }

// // Function to extract Exif metadata
// export const extractMetadata = async (buffer) => {
//   const parser = exifParser.create(buffer);
//   return parser.parse();
// };
