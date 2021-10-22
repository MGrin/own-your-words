require("dotenv").config();

const express = require("express");
const cors = require("cors");
const twitter = require("./modules/twitter");

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  console.log("⚠️  ENABLING CORS");
  app.use(cors());
}

app.post("/twitter/authUrl", async (req, res) => {
  const { callbackUrl } = req.body;
  try {
    const authUrl = await twitter.getAuthLink(callbackUrl);
    return res.json({
      authUrl,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post("/twitter/accessToken", async (req, res) => {
  const { oauthToken, oauthVerifier } = req.body;
  try {
    const data = await twitter.getAccessToken({ oauthToken, oauthVerifier });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Service is running on port ${process.env.PORT}`)
);
