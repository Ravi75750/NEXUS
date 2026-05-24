import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { generate } from "otp-generator";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.example if .env doesn't exist (helpful for this specific environment setup)
import fs from 'fs';
if (!fs.existsSync(path.resolve(__dirname, '.env')) && fs.existsSync(path.resolve(__dirname, '.env.example'))) {
  dotenv.config({ path: path.resolve(__dirname, '.env.example') });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB Cluster");
    } catch (err) {
      console.error("MongoDB Connection Error:", err);
    }
  } else {
    console.warn("MONGODB_URI not found in environment variables. Database operations will fail.");
  }

  // Cloudinary Config
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Multer Storage for Cloudinary
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "nexus_assets",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    } as any,
  });
  const upload = multer({ storage });

  app.use(cors());
  app.use(express.json());

  // --- MODELS ---
  const projectSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    image: String,
    projectUrl: String,
    tags: [String],
    color: String,
  }, { timestamps: true });
  const Project = mongoose.model("Project", projectSchema);

  const quotationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    status: { type: String, default: "pending" },
  }, { timestamps: true });
  const Quotation = mongoose.model("Quotation", quotationSchema);

  const reviewSchema = new mongoose.Schema({
    clientName: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    content: String,
    rating: Number,
    avatar: String,
    service: String,
  }, { timestamps: true });
  const Review = mongoose.model("Review", reviewSchema);

  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    avatar: String,
  }, { timestamps: true });
  const User = mongoose.model("User", userSchema);

  const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, expires: '5m', default: Date.now }
  });
  const OTP = mongoose.model("OTP", otpSchema);

  const teamMemberSchema = new mongoose.Schema({
    name: String,
    role: String,
    image: String,
    bio: String,
    socials: {
      github: String,
      linkedin: String,
      twitter: String,
    }
  }, { timestamps: true });
  const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

  const orderSchema = new mongoose.Schema({
    clientName: String,
    email: String,
    phone: String,
    projectName: String,
    value: Number,
    status: { type: String, default: "active" },
    startDate: { type: Date, default: Date.now },
    deadline: Date,
  }, { timestamps: true });
  const Order = mongoose.model("Order", orderSchema);

  // --- STATUS ENDPOINT ---
  app.get("/api/db-status", (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({ 
      status: states[mongoose.connection.readyState] || "unknown",
      readyState: mongoose.connection.readyState,
      database: mongoose.connection.name
    });
  });

  // --- MAIL CONFIG ---
  console.log("Initializing Mail System...");
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("CRITICAL: EMAIL_USER or EMAIL_PASS environment variables are MISSING.");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: (process.env.EMAIL_USER || "").trim(),
      pass: (process.env.EMAIL_PASS || "").trim(),
    },
  });

  // --- AUTH ROUTES ---
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already registered" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, name });
      await user.save();

      const otp = generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
      await OTP.create({ email, otp });

      // Send Email
      try {
        await transporter.sendMail({
          from: `"Nexus Solutions" <${process.env.FROM_EMAIL}>`,
          to: email,
          subject: "Nexus Verification Code",
          text: `Your verification code is ${otp}. It expires in 5 minutes.`,
          html: `<b>Your verification code is ${otp}</b><p>It expires in 5 minutes.</p>`,
        });
      } catch (mailErr) {
        console.error("Failed to send OTP email:", mailErr);
      }

      res.json({ success: true, message: "OTP sent to email" });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/verify", async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const validOtp = await OTP.findOne({ email, otp });
      if (!validOtp) return res.status(400).json({ error: "Invalid or expired OTP" });

      await User.findOneAndUpdate({ email }, { isVerified: true });
      await OTP.deleteOne({ email, otp });

      const user = await User.findOne({ email });
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

      res.json({ token, user });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });
      if (!user.isVerified) return res.status(400).json({ error: "Account not verified", unverified: true });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      res.json({ token, user });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/auth/me", async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await User.findById(decoded.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(401).json({ error: "Token invalid" });
    }
  });

  // --- API ROUTES ---
  
  // Orders
  app.get("/api/orders", async (req, res, next) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/orders", async (req, res, next) => {
    try {
      const order = new Order(req.body);
      await order.save();
      res.json(order);
    } catch (err) {
      next(err);
    }
  });
  app.put("/api/orders/:id", async (req, res, next) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(order);
    } catch (err) {
      next(err);
    }
  });
  app.delete("/api/orders/:id", async (req, res, next) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  // Projects
  app.get("/api/projects", async (req, res, next) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.json(projects);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/projects", async (req, res, next) => {
    try {
      const project = new Project(req.body);
      await project.save();
      res.json(project);
    } catch (err) {
      next(err);
    }
  });
  app.put("/api/projects/:id", async (req, res, next) => {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(project);
    } catch (err) {
      next(err);
    }
  });
  app.delete("/api/projects/:id", async (req, res, next) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  // Contact Inquiries (formerly Quotations)
  app.get("/api/contact", async (req, res, next) => {
    try {
      const quotations = await Quotation.find().sort({ createdAt: -1 });
      res.json(quotations);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/contact", async (req, res, next) => {
    try {
      const quotation = new Quotation(req.body);
      await quotation.save();
      res.json(quotation);
    } catch (err) {
      next(err);
    }
  });

  // Reviews
  app.get("/api/reviews", async (req, res, next) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/reviews", async (req, res, next) => {
    try {
      const review = new Review(req.body);
      await review.save();
      res.json(review);
    } catch (err) {
      next(err);
    }
  });

  // Team Members
  app.get("/api/team", async (req, res, next) => {
    try {
      const team = await TeamMember.find().sort({ createdAt: 1 });
      res.json(team);
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/team", async (req, res, next) => {
    try {
      const member = new TeamMember(req.body);
      await member.save();
      res.json(member);
    } catch (err) {
      next(err);
    }
  });
  app.delete("/api/team/:id", async (req, res, next) => {
    try {
      await TeamMember.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  // Image Upload
  app.post("/api/upload", upload.single("image"), (req: any, res) => {
    if (req.file) {
      res.json({ url: req.file.path });
    } else {
      res.status(400).json({ error: "Upload failed" });
    }
  });

  // API 404 Handler - Catch-all for unknown /api/* routes
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  // Global Error Handler for API
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API Error:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message,
      code: err.name === 'MongooseError' ? 'DB_ERROR' : 'GENERIC_ERROR'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
