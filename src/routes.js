import express from "express";

import { facultyDetailPage, facultyListPage } from "./controllers/index.js";

const router = express.Router();

router.get("/faculty", facultyListPage);
router.get("/faculty/:facultyId", facultyDetailPage);

export default router;
