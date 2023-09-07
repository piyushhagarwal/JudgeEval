import express from "express";
import {
  getAllTeams,
  createTeam,
  getTeamDetails,
  updateTeam,
  deleteTeam,
} from "../controllers/teams"; // Import the controller function

import fetchCompetition from "../middleware/fetchCompetition";

const router = express.Router();

// Route to fetch all teams
router.get("/", fetchCompetition, getAllTeams);

// Route to create a new team
router.post("/", fetchCompetition, createTeam);

// Route to get details of a team
router.get("/:id", fetchCompetition, getTeamDetails);

// Route to update details of a specific team
router.patch("/:id", fetchCompetition, updateTeam);

// Route to delete a Team
router.delete("/:id", fetchCompetition, deleteTeam);

export default router;
