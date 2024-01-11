// import express from "express";
// import {
//   extractMetadata,
//   processImage,
// } from "../controller/imageController.js";
// import ImageModel from "../model/imageDetail.js";
// import multer from "multer";
// import fs from "fs";
//       // var CloudmersiveImageApiClient = require("cloudmersive-image-api-client");
// import CloudmersiveConvertApiClient from "cloudmersive-convert-api-client";
// // import pkg from "cloudmersive-convert-api-client";
// // const  ConvertApi  = pkg;
//       // var CloudmersiveConvertApiClient = require("cloudmersive-convert-api-client");

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// const upload = multer({
//   storage: storage,
// }).single("image");

// console.log("sotrage", upload.storage);
// // Route for uploading images
// // Route for uploading images
// export const uploadImage = router.post("/upload", (req, res) => {
//   console.log("Received request");
//   try {
//     console.log("Processing image...");

//     upload(req, res, async (err) => {
//       if (err) {
//         console.error("Multer error:", err);
//         return res
//           .status(400)
//           .json({ success: false, message: "Invalid file upload request" });
//       }

//       // Log req.file to inspect its structure
//       console.log("req.file:", req.file);

//       // Read the image file and pass its buffer to processImage
//       const imageBuffer = fs.readFileSync(req.file.path);
//       console.log("Uploaded file mimetype:", req.file.mimetype);

//       console.log("imageBuffer", imageBuffer);
//       console.log("imageBuffer", req.file.destination);

//       //
//       var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

//       // Configure API key authorization: Apikey
//       var Apikey = defaultClient.authentications["Apikey"];
//       Apikey.apiKey = "2a719f14-cf82-4564-9577-c747c3dea632";
//       // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//       //Apikey.apiKeyPrefix = 'Token';

//       var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

//       var inputFile = req.file.path; // File | Input file to perform the operation on.
//       console.log(inputFile)
//       var opts = {
//         quality: 56, // Number | Optional; Set the JPEG quality level; lowest quality is 1 (highest compression), highest quality (lowest compression) is 100; recommended value is 75. Default value is 75.
//       };

//       var callback = function (error, data, response) {
//         if (error) {
//           console.error(error);
//         } else {
//           console.log("API called successfully. Returned data: " + data);
//         }
//       };
//       await apiInstance.convertDocumentAutodetectToJpg(inputFile, opts, callback);

//       //
//       // Process and save the image
//       const processedImageBuffer = imageBuffer
//         ? await processImage(req.file.path)
//         : null;

//       if (req.file && processedImageBuffer) {
//         // ... rest of your code
//         const image = new ImageModel({
//           filename: req.file.originalname,
//           metadata: await extractMetadata(processedImageBuffer),
//         });
//         await image.save();

//         res.json({ success: true, message: "Image uploaded successfully" });
//       } else {
//         console.log("Invalid file upload request");
//         res
//           .status(400)
//           .json({ success: false, message: "Invalid file upload request" });
//       }
//     });
//   } catch (error) {
//     console.error("Internal Server Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });
import express from "express";
import {
  extractMetadata,
  processImage,
} from "../controller/imageController.js";
import ImageModel from "../model/imageDetail.js";
import multer from "multer";
import fs from "fs";
import CloudmersiveConvertApiClient from "cloudmersive-convert-api-client";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

router.post("/upload", async (req, res) => {
  try {
    console.log("Received request");
    console.log("Processing image...");

    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({ success: false, message: "Invalid file upload request" });
      }

      // Log req.file to inspect its structure
      console.log("req.file:", req.file);

      // Read the image file and pass its buffer to processImage
      const imageBuffer = fs.readFileSync(req.file.path);
      console.log("Uploaded file mimetype:", req.file.mimetype);

      console.log("imageBuffer", imageBuffer);
      console.log("imageBuffer", req.file.destination);

      const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

      // Configure API key authorization: Apikey
      const Apikey = defaultClient.authentications["Apikey"];
      Apikey.apiKey = "2a719f14-cf82-4564-9577-c747c3dea632"; // Replace with your Cloudmersive API key

      const apiInstance = new CloudmersiveConvertApiClient.ConvertImageApi();
      const inputFile = imageBuffer; // Pass the buffer directly
      console.log("inputFile", inputFile);

      const format1 = "UNKNOWN"; // You can set the input format as UNKNOWN if it's unknown
      const format2 = "JPG"; // Set the desired output format, for example, JPG

      const opts = {
        quality: 75,
      };

      try {
        console.log("Calling Cloudmersive API for image conversion...");

        // Call Cloudmersive API for image conversion
        const conversionResult =
          await apiInstance.convertImageImageFormatConvert(
            format1,
            format2,
            inputFile,
            opts
          );
            console.log(conversionResult)
        if (conversionResult) {
          // Process and save the image
          const processedImageBuffer = await processImage(conversionResult);
          console.log(processedImageBuffer)
          if (processedImageBuffer) {
            const image = new ImageModel({
              filename: req.file.originalname,
              metadata: await extractMetadata(processedImageBuffer),
            });
            await image.save();

            // Send the response only once
            return res.json({
              success: true,
              message: "Image uploaded successfully",
            });
          } else {
            console.log("Invalid file upload request");
            // Send the response only once
            return res.status(400).json({
              success: false,
              message: "Invalid file upload request",
            });
          }
        }
      } catch (error) {
        console.error("Error in image conversion or processing:", error);
        // Handle the error and send the response only once
        return res.status(500).json({
          success: false,
          message: "Error in image conversion or processing",
        });
      }
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export { router as uploadImage };
