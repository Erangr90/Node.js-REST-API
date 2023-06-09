import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";
import caching from "../middleware/cacheMiddleware.js"

const router = express.Router();
router.route("/").post(registerUser).get(subscribe, admin, caching, getUsers);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(subscribe, getUserProfile)
  .put(subscribe, updateUserProfile);
router
  .route("/:id")
  .delete(subscribe, admin, deleteUser)
  .get(subscribe, admin, caching, getUserById)
  .put(subscribe, admin, updateUser);

export default router;
