import { verifyToken } from '../utils/jwtUtils.js';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';
import BlackToken from '../models/blackTokenModel.js';

const subscribe = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (token) {
    try {

      const decoded = verifyToken(token);
      const blacklistedToken = await BlackToken.findOne({ token });
      if (blacklistedToken) {
        res.status(401);
        throw new Error('Not authorized, token has been revoked');
      }
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { subscribe, admin };
