//require("dotenv").config();
const express = require("express");

const app = express();
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

/*app.post("/create-stream", async (req, res) => {
  const streamDetails = {
    webhookUrl: "https://music-nft-mu.vercel.app/api/webhook",
    description: "Listen to AlbumCreated events",
    tag: "album_created",
    chains: ["0x13881"],
    includeNativeTxs: true,
    abi: AlbumFactoryABI,
    topic0: ["AlbumCreated(address,address)"],
  };

  try {
    const stream = await Moralis.Streams.add(streamDetails);
    res.json(stream.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/

// 注意：这个操作通常在流创建后立即执行，所以最好是在创建流后自动执行或者通过另一个独立的请求来执行
/*app.post("/add-address-to-stream", async (req, res) => {
  const { streamId, address } = req.body; // 假设请求中包含了 streamId 和要添加的 address

  try {
    const response = await Moralis.Streams.addAddress({
      id: streamId,
      address: [address], // 这里可以是一个地址的数组
    });
    console.log("Address added to stream:", response.toJSON());
    res.json(response.toJSON());
  } catch (error) {
    console.error("Error adding address to stream:", error);
    res.status(500).json({ error: error.message });
  }
});*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
