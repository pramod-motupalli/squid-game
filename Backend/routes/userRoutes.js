import { Router } from "express";
import { createUser, getAllUsers, getUserByUsername, updateUserPassword, deleteUser } from "../controllers/userController";

const router = Router();

// Define API routes
router.post("/create", createUser);
router.get("/all", getAllUsers);
router.get("/:username", getUserByUsername);
router.put("/:username", updateUserPassword);
router.delete("/:username", deleteUser);

export default router;
