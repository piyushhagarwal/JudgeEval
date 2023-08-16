import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await queryDatabase("SELECT * FROM teams");
    res.status(200).json({ teams, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", success: false });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { team_name, other_team_details } = req.body;

  try {
    const query = `
      INSERT INTO teams
      (team_name, other_team_details)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const newTeam = await queryDatabase(query, [team_name, other_team_details]);

    res.status(201).json({ newTeam, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating a new team", success: false });
  }
};

export const getTeamDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM teams WHERE id = $1";
    const team = await queryDatabase(query, [id]);

    if (team) {
      res.status(200).json({ team: team[0], success: true });
    } else {
      res.status(404).json({ message: "Team not found", success: false });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching team details", success: false });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;
    const { team_name, other_team_details } = req.body;

    const query = `
        UPDATE teams
        SET team_name = COALESCE($1, team_name), other_team_details = COALESCE($2, other_team_details)
        WHERE team_id = $3
        RETURNING *;
      `;
    //The COALESCE function is used in the UPDATE query to conditionally update only the non-null values passed in the request. This means if a value is provided in the request body, it will be updated, otherwise, the existing value will be retained.

    const values = [team_name, other_team_details, teamId];

    const updatedTeam = await queryDatabase(query, values);

    if (updatedTeam.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    res.status(200).json({ updatedTeam: updatedTeam[0], success: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating team:", success: false });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;

    const query = `
        DELETE FROM teams
        WHERE team_id = $1
        RETURNING *;
      `;

    const values = [teamId];

    const deletedTeam = await queryDatabase(query, values);

    if (deletedTeam.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    res.status(200).json({ deletedTeam: deletedTeam[0], success: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Team:", success: false });
  }
};
