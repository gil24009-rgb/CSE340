import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

router.use(express.static(publicPath));
router.use("/css", express.static(path.join(publicPath, "css")));
router.use("/js", express.static(path.join(publicPath, "js")));
router.use("/images", express.static(path.join(publicPath, "images")));

export default router;
