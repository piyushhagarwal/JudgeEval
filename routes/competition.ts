const express = require("express");

const router = express.Router();

import {
  createCompetition,
  getAllCompetitions,
  loginCompetition,
} from "../controllers/competiton";

router.route("/").post(createCompetition).get(getAllCompetitions);

router.route("/login").post(loginCompetition);

export default router;
