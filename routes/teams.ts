import express from 'express';
import { getAllTeams, createTeam, getTeamDetails, updateTeam} from '../controllers/teamsController'; // Import the controller function

const router = express.Router();

// Route to fetch all teams
router.get('/', getAllTeams);

// Route to create a new team
router.post('/', createTeam);

// Route to get details of a team
router.get('/:id', getTeamDetails);

// Route to update details of a specific team
router.put('/:id', updateTeam);

// ... Other routes ...

export default router;