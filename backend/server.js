import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

const __dirname = path.resolve();
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 8000;

// app.use(express.json()); // to parse the incoming requests with json payloads(req.body)
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser()); // to parse the incoming requests with cookies
app.use(express.static(path.join(__dirname, "/frontend/dist")));

/***Routes***/
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

connectToMongoDB()
  .then(() => {
    server.on("error", (error) => {
      console.log("Error:", error?.message || "Some Error occured!!!");
    });

    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error?.message || "MongoDB Connection Failed!!!");
  });
