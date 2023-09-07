import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const { competition_id } = req.headers;
    if (!competition_id) {
      return res
        .status(500)
        .json({ message: "Competition id not present", success: false });
    }
    console.log(competition_id);
    const teams = await queryDatabase(
      "SELECT * FROM teams WHERE competition_id = $1",
      [competition_id]
    );
    res.status(200).json({ teams, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", success: false });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { team_name, other_team_details } = req.body;

  try {
    const { competition_id } = req.headers;
    if (!competition_id) {
      return res
        .status(500)
        .json({ message: "Competition id not present", success: false });
    }

    const query = `
      INSERT INTO teams
      (team_name, other_team_details, competition_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const newTeam = await queryDatabase(query, [
      team_name,
      other_team_details,
      competition_id,
    ]);

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
    const { competition_id } = req.headers;
    if (!competition_id) {
      return res
        .status(500)
        .json({ message: "Competition id not present", success: false });
    }
    const query = "SELECT * FROM teams WHERE id = $1 AND competion_id = $2";
    const team = await queryDatabase(query, [id, competition_id]);

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
    const { competition_id } = req.headers;
    if (!competition_id) {
      return res
        .status(500)
        .json({ message: "Competition id not present", success: false });
    }

    const query = `
        UPDATE teams
        SET team_name = COALESCE($1, team_name), other_team_details = COALESCE($2, other_team_details)
        WHERE team_id = $3 AND competition_id = $4
        RETURNING *;
      `;
    //The COALESCE function is used in the UPDATE query to conditionally update only the non-null values passed in the request. This means if a value is provided in the request body, it will be updated, otherwise, the existing value will be retained.

    const values = [team_name, other_team_details, teamId, competition_id];

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
    const team_id = req.params.id;
    const { competition_id } = req.headers;
    if (!competition_id) {
      return res
        .status(500)
        .json({ message: "Competition id not present", success: false });
    }

    const query = `
        DELETE FROM teams
        WHERE team_id = $1 AND competition_id = $2
        RETURNING *;
      `;

    const values = [team_id, competition_id];

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
