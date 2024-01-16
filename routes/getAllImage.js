import express from "express";
import ImageModel from "../model/imageDetail.js";

const router = express.Router();

const getAllImages = router.get("/images", async (req, res) => {
  try {
    // Find all image data
    const allImageData = await ImageModel.find();

    return res.json({
      success: true,
      data: allImageData,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default getAllImages;
