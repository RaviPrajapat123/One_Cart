// uploadRoute.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { MongoClient } from 'mongodb';

const pump = promisify(pipeline);

export async function imageUploadRoute(fastify, options) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("oneCart");
  const products = db.collection("products");

  fastify.post("/upload-image", async (req, reply) => {
    try {
      const data = await req.file();

      if (!data) {
        return reply.status(400).send({ error: "No file uploaded" });
      }

      const uploadDir = "./uploads";
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const filePath = path.join(uploadDir, data.filename);
      await pump(data.file, fs.createWriteStream(filePath));

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "oneCart",
      });

      fs.unlinkSync(filePath);

    //   const saved = await products.insertOne({
    //     imageUrl: result.secure_url,
    //     uploadedAt: new Date(),
    //   });

      return reply.send({ url: result.secure_url });
    } catch (error) {
      console.error("Upload error:", error);
      return reply.status(500).send({ error: "Server error while uploading image" });
    }
  });
}
