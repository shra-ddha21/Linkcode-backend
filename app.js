import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = ["http://localhost:5173", "http://127.0.0.1:5173"];
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

console.log("CORS middleware initialized with origins: http://localhost:5173, http://127.0.0.1:5173");

app.use(express.json());

export default app;
