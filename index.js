import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { uploadImage } from "./routes/imageUpload.js";
import bodyparser from "body-parser"
import cors from "cors"
import path from "path";
import getAllImages from "./routes/getAllImage.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: ["https://imageprocessingapp.netlify.app", "http://127.0.0.1:5173"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));

// app.use("/images", express.static("images"));
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "../public/images")));


// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_DB,
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
);



// Routes
app.get("/", (req, res) => {
  res.send("Hello, welcome to the Image Processing App!");
});

app.use("/api", uploadImage)
app.use("/api", getAllImages)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
