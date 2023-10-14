const express = require("express");

const router = express.Router();

import {
  createCompetition,
  getAllCompetitions,
  loginCompetition,
  deleteCompetition,
} from "../controllers/competiton";

router.route("/").post(createCompetition).get(getAllCompetitions);

router.route("/:id").delete(deleteCompetition);

router.route("/login").post(loginCompetition);

export default router;
