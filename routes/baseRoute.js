import express from "express";

import * as baseController from "../controllers/baseController.js";

const router = express.Router();

router.get("/", baseController.buildHome);

export default router;
