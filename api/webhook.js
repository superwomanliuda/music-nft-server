const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("Received webhook:", req.body);
  // 处理Webhook逻辑
  res.status(200).send("Webhook received!");
});

module.exports = router;
