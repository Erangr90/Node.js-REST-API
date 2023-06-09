import crypto from "crypto";

const encryptionKey = crypto
  .createHash("sha256")
  .update(process.env.ENCRYP_KEY)
  .digest("hex")
  .slice(0, 32);

const encrypt = (data) => {
  const serializedData = JSON.stringify(data);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encryptedData = cipher.update(serializedData, "utf8", "hex");
  encryptedData += cipher.final("hex");
  const combinedData = iv.toString("hex") + encryptedData;
  return combinedData;
};

const decrypt = (data) => {
  const combinedData = Buffer.from(data, "hex");
  const iv = Buffer.from(combinedData.subarray(0, 16));
  const encryptedData = Buffer.from(combinedData.subarray(16));
  const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  const deserializedData = JSON.parse(decryptedData);
  return deserializedData;
};

export { encrypt, decrypt };
