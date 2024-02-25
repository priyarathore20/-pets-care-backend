import express from "express";
import mongoose from "mongoose";
import { PORT, URL } from "./config.js";
import router from "./routes/router.js";
import cors from "cors";
import petRouter from "./routes/petRoutes.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/pets", petRouter);
app.use("/", router);

mongoose
  .connect(URL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log("App is listening to port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
