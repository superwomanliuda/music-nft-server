const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.database();

router.post("/", (req, res) => {
  console.log("Received webhook:", req.body);

  if (req.body.confirmed && req.body.logs && req.body.logs.length > 0) {
    const log = req.body.logs[0];
    const albumAddress = log.address;
    const ownerAddress = `0x${log.topic2.slice(-40)}`; // 取 topic2 的最后40个字符，转换为地址
    const ipfsUri = parseIPFSUri(log.data); // 使用 parseIPFSUri() 函数解析 IPFS URI

    // 保存到 Firebase Realtime Database
    const albumsRef = db.ref("albums");
    albumsRef.push(
      {
        albumAddress,
        ownerAddress,
        ipfsUri,
        timestamp: new Date().toISOString(),
      },
      (error) => {
        if (error) {
          console.error("Data could not be saved." + error);
          res.status(500).send("Data could not be saved.");
        } else {
          console.log("Data saved successfully.");
          res.status(200).send("Webhook received and data saved successfully!");
        }
      }
    );
  } else {
    console.log("Webhook received but no logs found.");
    res.status(200).send("Webhook received but no logs found.");
  }
});

function parseIPFSUri(hexData) {
  let strData = "";
  for (let i = 0; i < hexData.length; i += 2) {
    const part = hexData.substr(i, 2);
    const charCode = parseInt(part, 16);
    if (charCode !== 0) {
      // 忽略空字符
      strData += String.fromCharCode(charCode);
    }
  }

  const ipfsUri = strData.match(/ipfs:\/\/[^\s]+/);
  return ipfsUri ? ipfsUri[0] : "";
}

module.exports = router;
