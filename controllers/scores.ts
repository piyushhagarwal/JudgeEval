import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const score = async (req: Request, res: Response) => {
  try {
    const { team_id, parameter_id, score_value } = req.body;
    const judge_id = req.headers.judge_id;

    const query = `
        INSERT INTO scores ( judge_id, team_id, parameter_id, score_value)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

    const values = [judge_id, team_id, parameter_id, score_value];

    const newScore = await queryDatabase(query, values);

    res.status(201).json({ newScore: newScore[0], success: true });
  } catch (error) {
    res.status(500).json({ message: "Error adding score:", success: false });
  }
};
