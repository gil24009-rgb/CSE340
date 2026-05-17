import express from "express";

import {
  buildAbout,
  buildHome,
} from "../controllers/baseController.js";

const router = express.Router();

router.get("/", buildHome);
router.get("/about", buildAbout);

export default router;
