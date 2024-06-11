import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import { PORT, URL } from "./src/config.js";
import router from "./src/routes/index.js";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(json());
app.use(urlencoded({ extends: true }));

app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );
app.use(helmet());

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "The page is connected." });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

mongoose
  .connect(URL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      app.use(router);
      console.log("App is listening to port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
