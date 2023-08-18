import { Request, Response } from "express";
import queryDatabase from "../database/connection";
//if judge_id,parameter_id and team_id is not present

export const score = async (req: Request, res: Response) => {
  try {
    const { team_id, parameter_id, score_value } = req.body;
    const judge_id = req.headers.judge_id;

    //To prevent adding scores in the database which have judge_id = NULL
    if (!judge_id) {
      return res.status(500).json({
        message: "Judge id not found, Check auth token.",
        success: false,
      });
    }

    //To prevent adding scores in the database whose judge_id is not present
    //To prevent adding scores in the database whose parameter_id is not present
    //To prevent adding scores in the database whose team_id is not present

    //To prevent adding duplicate scores in the database
    const alreadyExistQuery = `
      SELECT * FROM scores 
      WHERE judge_id = $1 AND team_id = $2 AND parameter_id = $3;  
    `;

    const duplicateScore = await queryDatabase(alreadyExistQuery, [
      judge_id,
      team_id,
      parameter_id,
    ]);

    if (duplicateScore.length !== 0 || !duplicateScore) {
      return res
        .status(500)
        .json({ message: "Score already exists", success: false });
    }

    //Main query to add score
    const query = `
        INSERT INTO scores ( judge_id, team_id, parameter_id, score_value)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

    const values = [judge_id, team_id, parameter_id, score_value];

    const newScore = await queryDatabase(query, values);

    res.status(201).json({ newScore: newScore[0], success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding score(Internal Server Error)",
      success: false,
    });
  }
};
