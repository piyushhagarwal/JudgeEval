const express = require("express");

const router = express.Router();

import fetchCompetition from "../middleware/fetchCompetition";
import {
  getOverallResult,
  getParameterWiseScores,
  getparameterResult,
} from "../controllers/result";

router.get("/final", fetchCompetition, getOverallResult);
router.get("/allteams", fetchCompetition, getParameterWiseScores);
router.get("/parameterresult", fetchCompetition, getparameterResult);

export default router;
