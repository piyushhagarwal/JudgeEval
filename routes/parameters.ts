import express from "express";
import {
  getAllParameters,
  getSingleParameter,
  createParameter,
  updateParameter,
  deleteParameter,
} from "../controllers/parameters"; // Import the controller function

import fetchCompetition from "../middleware/fetchCompetition";

const router = express.Router();

// Route to fetch all parameters
router.get("/", fetchCompetition, getAllParameters);

// Route to fetch all parameters
router.get("/:id", fetchCompetition, getSingleParameter);

// Route to create a new parameter
router.post("/", fetchCompetition, createParameter);

// Route to update details of a specific parameter
router.patch("/:id", fetchCompetition, updateParameter);

// Route to delete parameter
router.delete("/:id", fetchCompetition, deleteParameter);

export default router;
