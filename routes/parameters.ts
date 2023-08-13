import express from "express";
import {
  getAllParameters,
  getSingleParameter,
  createParameter,
  updateParameter,
  deleteParameter,
} from "../controllers/parameters"; // Import the controller function

const router = express.Router();

// Route to fetch all parameters
router.get("/", getAllParameters);

// Route to fetch all parameters
router.get("/:id", getSingleParameter);

// Route to create a new parameter
router.post("/", createParameter);

// Route to update details of a specific parameter
router.patch("/:id", updateParameter);

// Route to delete parameter
router.delete("/:id", deleteParameter);

export default router;
