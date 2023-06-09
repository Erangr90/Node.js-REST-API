import jwt from 'jsonwebtoken';
import {encrypt} from '../lib/crypto.js';

let activeSecretKey = process.env.JWT_SECRET;

let previousSecretKeys = [process.env.JWT_SECRET];

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, activeSecretKey);
    return decoded;
  } catch (error) {
    for (const secretKey of previousSecretKeys) {
      try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
      } catch (error) {
      }
    }
    throw new Error('Invalid token');
  }
};

export const rotateSecretKeys = () => {
  const newSecretKey = encrypt(Date.now().toString(36));
  previousSecretKeys.push(activeSecretKey);
  activeSecretKey = newSecretKey;
};
