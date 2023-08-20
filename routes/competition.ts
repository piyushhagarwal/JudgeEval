const express = require("express");

const router = express.Router();

import {
  createCompetition,
  getAllCompetitions,
} from "../controllers/competiton";

router.route("/").post(createCompetition).get(getAllCompetitions);

export default router;
