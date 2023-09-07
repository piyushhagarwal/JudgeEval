const express = require("express");

const router = express.Router();

import {
  getAllJudges,
  getSingleJudge,
  createJudge,
  loginJudge,
  updateJudge,
  deleteJudge,
} from "../controllers/judge";
import fetchCompetition from "../middleware/fetchCompetition";

router.post("/", fetchCompetition, createJudge);
router.route("/").get(getAllJudges);
router.route("/login").post(loginJudge);
router.route("/:id").get(getSingleJudge).patch(updateJudge).delete(deleteJudge);

export default router;
