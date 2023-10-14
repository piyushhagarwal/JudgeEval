const express = require("express");

const router = express.Router();

import { getAllScores, score } from "../controllers/scores";
import fetchCompetition from "../middleware/fetchCompetition";
import fetchJudge from "../middleware/fetchJudge";

router.post("/", fetchJudge, score);
router.get("/", fetchCompetition, getAllScores);

export default router;
