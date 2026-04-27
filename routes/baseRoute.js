import express from "express";

import {
  buildAbout,
  buildHome,
  buildProducts,
} from "../controllers/baseController.js";

const router = express.Router();

router.get("/", buildHome);
router.get("/about", buildAbout);
router.get("/products", buildProducts);

export default router;
