import express from "express";
import ImageModel from "../model/imageDetail.js";

const router = express.Router();

// Route to get image data
const getImageRoute  = router.get("/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Find the image data based on the filename
    const imageData = await ImageModel.findOne({ filename });

    if (!imageData) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.json({
      success: true,
      data: imageData,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default getImageRoute;
