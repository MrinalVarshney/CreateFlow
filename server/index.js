const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const socketServer = require("./socketServer")
const http = require("http")


dotenv.config();
const PORT = process.env.PORT;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}. Ready to accept requests!`);
});

const server = http.createServer(app);
socketServer.registerSocketServer(server);

