import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import BlackToken from "../models/blackTokenModel.js";
import redisClient from "../config/redis.js";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      clicks: user.clicks,
      subscriptions: user.subscriptions,
      carts: user.carts,
      products: user.products,
      orders: user.orders,
      isSubtribe: user.isSubtribe,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isSubtribe: user.isSubtribe,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(400).json({ message: "No token found" });
    return;
  }

  const blackToken = await BlackToken.create({ tokenId: token });

  if (!blackToken) {
    res.status(500).json({ message: "Logout failed" });
  }

  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Subscribe
const getUserProfile = asyncHandler(async (req, res) => {
  let user = undefined
  try {
    user = await redisClient.get(
      `${req.originalUrl.split("/")[2]}:${req.user._id}`,
    );
    user = JSON.parse(user)
  } catch (error) {
    console.error(error)
  }

  if(!user){
      user = await User.findById(req.user._id);
  }

  if (user) {
    res.json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      subscriptions: user.subscriptions,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Subscribe
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key) && key !== "password") {
        const value = req.body[key];
        user[key] = value;
      }
    }

    if (req.body.password) {
      const token = req.cookies.jwt;

      if (!token) {
        res.status(400).json({ message: "No token found" });
        return;
      }

      const blackToken = await BlackToken.create({ tokenId: token });

      if (!blackToken) {
        res.status(500).json({ message: "Change password failed" });
      }

      generateToken(res, user._id);

      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      subscriptions: updatedUser.subscriptions,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete admin user");
    }
    await User.deleteOne({ _id: user._id });

    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        const value = req.body[key];
        user[key] = value;
      }
    }

    const updatedUser = await user.save();


    res.json({
      _id: user._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      subscriptions: updatedUser.subscriptions,
      isAdmin: updatedUser.isAdmin,
      isSubtribe: updatedUser.isSubtribe,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
