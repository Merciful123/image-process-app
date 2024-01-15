import express from "express";
import multer from "multer";
import {ExifTool} from "exiftool-vendored";
import fs from "fs/promises";
import path from "path";
import ImageModel from "../model/imageDetail.js";
const exiftool = new ExifTool({ taskTimeoutMillis: 5000 });
const router = express.Router();



// const exiftool = exiftool.ExifTool;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + file.originalname.slice(-4); // Keep the file extension
    cb(null, filename);
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 /* bytes */ },
}).single("image");


export const uploadImage = router.post(
  "/image/convert/to/jpg",
  upload,
  async (req, res) => {
    try {
      console.log("Received request");
      console.log("Processing image...");

      if (!req.file) {
        console.error("Multer error: No file received");
        return res
          .status(400)
          .json({ success: false, message: "No file received" });
      }

      console.log("req.file:", req.file);

      // Use exiftool to extract JPEG from RAW image
      
      await exiftool.extractJpgFromRaw(
        req.file.path,
        req.file.path.replace(/\.\w+$/, ".jpg")
      );

      console.log("Conversion complete.");

      // Define the path to the converted JPEG file
      
      const convertedImagePath = req.file.path.replace(/\.\w+$/, ".jpg");
      
      const convertedFileName = path.basename(convertedImagePath);

      // console.log(req.file.filename);
      // console.log(req.file.path);
      // console.log(convertedImagePath);

      // Use exiftool to get metadata

      const metadata = await getMetadata(req.file.path);

      // Save metadata and image details to your collection
      
      const imageDetails = {
        filename: convertedFileName,
        metadata: metadata,
      };
      console.log(imageDetails);
      
      // Create a new instance of ImageModel
      
      const imageInstance = new ImageModel(imageDetails);

      // Save the image instance to the database
      
      await imageInstance.save();

      // Optional: Remove the original RAW file
      
      await fs.unlink(req.file.path);

      return res.json({
        success: true,
        message: "Image uploaded and converted successfully",
      });
    } catch (error) {
      console.error("Internal Server Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

// Helper function to get metadata using exiftool-vendored

async function getMetadata(filePath) {
  try {
    // Read metadata tags using exiftool-vendored

    const metadataTags = await exiftool.read(filePath);

    // console.log(metadataTags)

    // Extract specific tags

    const lens = metadataTags.Lens || "N/A";
    const lensAF = metadataTags.LensAF || "N/A";
    const AFPointsInFocus = metadata.AFPointsInFocus || "N/A";
    const AFPointsSelected = metadata.AFPointsSelected || "N/A";

    
    const captureTime = metadataTags.CreateDate || metadataTags.DateTimeOriginal || "N/A";
    const iso = metadataTags.ISO || "N/A";
    const speed = metadataTags.ShutterSpeed || "N/A";
    const aperture = metadataTags.ApertureValue || "N/A";
    const fileName = metadataTags.FileName || "N/A";
    const imageSize = metadataTags.ImageSize || "N/A";
    const whiteBalance = metadataTags.WhiteBalance || "N/A";
    const rating = metadataTags.Rating || "N/A";
    const colour = metadataTags.ColorSpace || "N/A";
    const camera = metadataTags.Model || "N/A";

    // Create an object with the extracted metadata

    const extractedMetadata = {
      lens,
      lensAF,
      AFPointsInFocus,
      AFPointsSelected,
      captureTime,
      iso,
      speed,
      aperture,
      fileName,
      imageSize,
      whiteBalance,
      rating,
      colour,
      camera,
    };

    return extractedMetadata;
  } catch (error) {
    console.error("Error getting metadata:", error);
    throw new Error("Error getting metadata");
  }
}




 
