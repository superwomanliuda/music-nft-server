//require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
// CORS配置
const corsOptions = {
  origin: "https://liuda-music-nft.web.app", // 前端托管之后记得修改此处
};
app.use(cors(corsOptions));
app.use(express.json());

const AlbumFactoryABI = require("./abi/AlbumFactory.json");

const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://music-nft-server-b8ff3-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const Moralis = require("moralis").default;
const webhookRouter = require("./api/webhook");

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
Moralis.start({ apiKey: MORALIS_API_KEY });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/webhook", webhookRouter);

app.post("/generateToken", (req, res) => {
  const userEthAddress = req.body.walletAddress;
  admin
    .auth()
    .createCustomToken(userEthAddress)
    .then((customToken) => {
      res.json({ token: customToken });
    })
    .catch((error) => {
      console.log("Error creating custom token:", error);
      res.status(500).send("Error creating custom token");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
