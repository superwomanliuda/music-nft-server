const express = require("express");
require("dotenv").config();
const Moralis = require("moralis").default;
const webhookRouter = require("./api/webhook");

const app = express();
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY; // 保密处理，不要硬编码
const AlbumFactoryABI = require("./abi/AlbumFactory.json");

// Moralis 初始化
Moralis.start({ apiKey: MORALIS_API_KEY });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/webhook", webhookRouter);

// 设置其他路由来管理Stream，例如创建Stream的路由
app.post("/create-stream", async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
