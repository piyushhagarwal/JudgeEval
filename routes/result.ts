const express = require("express");

const router = express.Router();

import fetchCompetition from "../middleware/fetchCompetition";
import {
  getOverallResult,
  getParameterWiseScores,
} from "../controllers/result";

router.get("/final", fetchCompetition, getOverallResult);
router.get("/allteams", fetchCompetition, getParameterWiseScores);

export default router;
