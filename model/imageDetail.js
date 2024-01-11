// Defining a schema for image metadata
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema

const ImageModel = mongoose.model("Image", imageSchema);

export default ImageModel


