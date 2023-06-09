const asyncHandler =
  (fn) =>
  async (...args) => {
    try {
      return await Promise.resolve(fn(...args));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export default asyncHandler;
