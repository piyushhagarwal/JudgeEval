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

router.route("/").post(createJudge).post(loginJudge).get(getAllJudges);
router.route("/:id").get(getSingleJudge).patch(updateJudge).delete(deleteJudge);

export default router;
