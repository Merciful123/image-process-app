import { ExifTool } from "exiftool-vendored";

const exiftool = new ExifTool({ taskTimeoutMillis: 5000 });



const getMetadata = async (filePath) => {
  try {
    // Read metadata tags using exiftool-vendored

    const metadataTags = await exiftool.read(filePath);

    // console.log(metadataTags)

    // Extract specific tags

    const lens = metadataTags.Lens || "N/A";
    const lensAF = metadataTags.LensAF || "N/A";
    const AFPointsInFocus = metadataTags.AFPointsInFocus || "N/A";
    const AFPointsSelected = metadataTags.AFPointsSelected || "N/A";

    const captureTime =
      metadataTags.CreateDate || metadataTags.DateTimeOriginal || "N/A";
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
};

export default getMetadata;
