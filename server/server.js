import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const server = express();

let PORT = process.env.PORT || 3000;

server.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL, {
    autoIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

server.post("/signup", (req, res) => {
  res.json(req.body);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
