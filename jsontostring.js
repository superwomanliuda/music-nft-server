const fs = require("fs");

// 替换为您的 JSON 文件路径
const filePath = "./serviceAccountFile.json";

// 读取 JSON 文件
const jsonContent = fs.readFileSync(filePath, "utf8");

// 将 JSON 对象转换为单行字符串
const jsonString = JSON.stringify(JSON.parse(jsonContent));

// 输出单行字符串
console.log(jsonString);
