const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes");
const noteRouter = require("./routes/noteRoutes")

dotenv.config();
connectDB();
const app = express();
app.use(cors({
  origin: ["https://notely-flow.vercel.app/login", "http://localhost:5173"],
  credentials: true
}))
app.use(express.json());
app.use("/api/auth", authRouter)
app.use("/api/note", noteRouter)
app.get("/", (req, res) => {
  res.send("hello world");
});
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
