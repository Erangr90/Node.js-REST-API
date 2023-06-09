import asyncHandler from "./asyncHandler.js";
import redisClient from "../config/redis.js";

const caching = asyncHandler(async (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }
  if (!redisClient.status === 'ready') {
    const error = new Error("Redis client is closed");
    error.statusCode = 500;
    console.log(error);
    return next();
  }
  let data = undefined;
  try {
    if (req.params.id) {
      data = await redisClient.get(
        `${req.originalUrl.split("/")[1]}:${req.params.id}`,
      );
      data = await JSON.parse(data)
    } else {
      const keys = await redisClient.keys(`${req.originalUrl.split("/")[1]}:*`);
      if (keys) data = [];
      for (const key of keys) {
        const value = await redisClient.get(key);
        const parseValue = await JSON.parse(value)
        data.push(parseValue);
      }
    }
  } catch (error) {
    console.log(error);
    return next()
  }
  if (data) {
    res.json(data);
  } else {
    next();
  }
});

export default caching;
