import "dotenv/config"; 
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import askRoutes from "./routes/askRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://document-qa-app-eta.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use("/api", askRoutes);

app.use((err, req, res, next) => {
  if (err.status === 413) {
    return res.status(413).json({ error: "Payload too Large." });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
