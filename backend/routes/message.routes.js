import { Router } from "express";
import { sendMessage,getMessage } from "../controllers/message.controller.js";
import protectRoute from "./../middlewares/protectRoute.js";
const router = Router();

router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage);
export default router;
