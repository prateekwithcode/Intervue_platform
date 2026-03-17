import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

// Inngest and API routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Intervue API is running 🚀"
  });
});


// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is up and running" });
});

// ✅ PRODUCTION: Serve frontend only if you include build in backend (optional)
// If your frontend is on Vercel, comment out or remove static serving.
// const __dirname = path.resolve();
// if (ENV.NODE_ENV === "production") {
//   const frontendDistPath = path.join(__dirname, "../frontend/dist");
//   app.use(express.static(frontendDistPath));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(frontendDistPath, "index.html"));
//   });
// }

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting server:", error);
  }
};

startServer();