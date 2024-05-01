import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { uploadImage } from "./routes/imageUpload.js";
import bodyparser from "body-parser"
import cors from "cors"
import path from "path";
import getAllImages from "./routes/getAllImage.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.PORT || 5001;

console.log(process.env.MONGO_DB);

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://imageprocessingapp.netlify.app",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
    ],
    methods: "GET,POST",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));


// Routes
// app.get("/", (req, res) => {
//   res.send("Hello, welcome to the Image Processing App!");
// });

app.use("/api", uploadImage)
app.use("/api", getAllImages)



app.use("/images", express.static("images"));


// serving frontend build

const frontendDistPath = join(__dirname, "./dist"); // Use join from path
app.use(express.static(frontendDistPath));

app.get("/", (req, res) => {
  res.sendFile(join(frontendDistPath, "index.html"));
});

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("connected to db")
  } catch (error) {
    console.log(error)
  }
}

connectToDB()
 



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
