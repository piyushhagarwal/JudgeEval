import { Request, Response } from 'express';
import { updateTeamDetails } from './dbFunctions';
import queryDatabase from '../database/connection';

export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const teams = await queryDatabase('SELECT * FROM teams');
        res.render('teams', { teams });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching teams');
    }
};

export const createTeam = async (req: Request, res: Response) => {
    const { name, members } = req.body;

    try {
        const query = 'INSERT INTO teams (name, members) VALUES ($1, $2) RETURNING *';
        const newTeam = await queryDatabase(query, [name, members]);

        res.status(201).json(newTeam);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating a new team');
    }
};

export const getTeamDetails = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM teams WHERE id = $1';
        const team = await queryDatabase(query, [id]);

        if (team) {
            res.json(team);
        } else {
            res.status(404).send('Team not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching team details');
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, members } = req.body;

    try {
        const updatedTeam = await updateTeamDetails(Number(id), name, members);

        if (updatedTeam) {
            res.json(updatedTeam);
        } else {
            res.status(404).send('Team not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating team details');
    }
};

