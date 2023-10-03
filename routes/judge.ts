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
router.get("/", fetchCompetition, getAllJudges);
router.get("/:id", fetchCompetition, getSingleJudge);
router.delete("/:id", fetchCompetition, deleteJudge);
router.patch("/:id", fetchCompetition, updateJudge);

router.route("/login").post(loginJudge);

export default router;
