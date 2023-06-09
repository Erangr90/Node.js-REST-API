import asyncHandler from './asyncHandler.js';
import { decrypt, encrypt } from '../lib/crypto.js';

const requestDecryption = asyncHandler(async (req, res, next) => {
  req.body = decrypt(req.body);
  next();
});

const responseEncryption = asyncHandler(async (req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    const encryptedBody = encrypt(body);
    originalSend.call(this, encryptedBody);
  };
  next();
});

export { requestDecryption, responseEncryption };

