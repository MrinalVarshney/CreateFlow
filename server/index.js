const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const socketServer = require("./socketServer")
const http = require("http")
const authRoutes = require("./routes/authRoutes");
const cookieSession = require("cookie-session")
const passport = require("./config/passport-config");
const googleAuthRoutes = require("./routes/googleAuthRoutes")
const canvasRoutes = require("./routes/canvasRoutes")


dotenv.config();
const PORT = process.env.PORT;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: ["Mrinal"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/user",authRoutes)
app.use("/auth/google",googleAuthRoutes)
app.use("/api/canvas",canvasRoutes)

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}. Ready to accept requests!`);
});

const server = http.createServer(app);
socketServer.registerSocketServer(server);

