const express = require("express");

const router = express.Router();

import { score } from "../controllers/scores";
import fetchJudge from "../middleware/fetchJudge";

router.post("/", fetchJudge, score);

export default router;
