import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";


import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 8000;

// app.use(express.json()); // to parse the incoming requests with json payloads(req.body)
app.use(express.json({ limit: "16kb" }));
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.static("public"))
app.use(cookieParser()); // to parse the incoming requests with cookies

/***Routes***/
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users",userRoutes)


connectToMongoDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error:", error?.message || "Some Error occured!!!");
    });

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error?.message || "MongoDB Connection Failed!!!");
  });
