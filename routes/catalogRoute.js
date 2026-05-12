import express from "express";

import {
  buildCatalog,
  buildCourseDetail,
} from "../controllers/catalogController.js";

const router = express.Router();

router.get("/", buildCatalog);
router.get("/:courseId", buildCourseDetail);

export default router;
