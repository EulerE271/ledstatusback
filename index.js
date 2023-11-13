const express = require("express");
const router = require("./routes/routes");
const cors = require("cors");
const apiLimiter = require("./middleware/rateLimiter");
const app = express();
const port = 3001;
require('dotenv').config();

app.use(express.json());

app.use(
  cors({
    origin: `${process.env.ORIGIN}`,
  })
);

app.use("/images", express.static("public/images"));

app.use("/api", apiLimiter, router);

app.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
