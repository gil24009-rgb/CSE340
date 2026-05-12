import express from "express";

import {
  buildFacultyDetail,
  buildFacultyList,
} from "../controllers/facultyController.js";

const router = express.Router();

router.get("/", buildFacultyList);
router.get("/:facultyId", buildFacultyDetail);

export default router;
