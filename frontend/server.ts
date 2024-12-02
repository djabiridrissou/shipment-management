import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port =  1221;

// Serve static files from the "build" directory
app.use(express.static(path.join(__dirname, "../build")));

// Handle all routes and send back the index.html from the "build" directory
app.get("*", (req, res) => {
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is listening on port ${port}`);
});

//