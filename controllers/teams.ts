import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await queryDatabase("SELECT * FROM teams");
    res.render("teams", { teams });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching teams");
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name, members } = req.body;

  try {
    const query =
      "INSERT INTO teams (name, members) VALUES ($1, $2) RETURNING *";
    const newTeam = await queryDatabase(query, [name, members]);

    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating a new team");
  }
};

export const getTeamDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM teams WHERE id = $1";
    const team = await queryDatabase(query, [id]);

    if (team) {
      res.json(team);
    } else {
      res.status(404).send("Team not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching team details");
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
    console.error("Error updating team:", error);
    res.status(500).json({ error, success: false });
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
    console.error("Error deleting Team:", error);
    res.status(500).json({ error, success: false });
  }
};
