const crypto = require("crypto");
const ivBase64 = Buffer.from([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
  0x0d, 0x0e, 0x0f,
]).toString("base64");
function getAlgorithm(keyBase64) {
  const key = Buffer.from(keyBase64, "base64");
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 32:
      return "aes-256-cbc";
  }
  throw new Error("Invalid key length: " + key.length);
}
function hashSecretKey() {
  var md5 = crypto.createHash("md5").update(process.env.SECRET_KEY).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");
  return keyBase64;
}
function encrypt(data) {
  if (!data) {
    return null;
  }
  const keyBase64 = hashSecretKey();
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");
  const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}
function decrypt(data) {
  if (!data) {
    return null;
  }
  const keyBase64 = hashSecretKey();
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
  let decrypted = decipher.update(data, "hex");
  decrypted += decipher.final();
  return decrypted;
}
function objectToQuery(data) {
  let result = new URLSearchParams(data).toString();
  return result;
}
function queryToObject(data) {
  let result = Object.fromEntries(new URLSearchParams(data));
  return result;
}
module.exports = {
  encrypt,
  decrypt,
  hashSecretKey,
  objectToQuery,
  queryToObject,
};
