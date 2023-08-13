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
  const { id } = req.params;
  const { name, members } = req.body;

  try {
    const query =
      "UPDATE teams SET name = $1, members = $2 WHERE id = $3 RETURNING *";
    const updatedTeam = queryDatabase(query, [name, members, id]);

    if (updatedTeam) {
      res.json(updatedTeam);
    } else {
      res.status(404).send("Team not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating team details");
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id; // Assuming the judge ID is passed as a parameter

    const query = `
        DELETE FROM teams
        WHERE judge_id = $1
        RETURNING *;
      `;

    const values = [teamId];

    const deletedTeam = await queryDatabase(query, values);

    if (deletedTeam.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Judge not found" });
    }

    res.status(200).json({ judge: deletedTeam[0], success: true });
  } catch (error) {
    console.error("Error deleting judge:", error);
    res.status(500).json({ error, success: false });
  }
};
