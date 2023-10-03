import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const score = async (req: Request, res: Response) => {
  try {
    const { team_id, parameter_id, score_value } = req.body;
    const judge_id = req.headers.judge_id;
    const competition_id = req.headers.competition_id;

    //To prevent adding scores in the database which have judge_id = NULL
    if (!judge_id) {
      return res.status(500).json({
        message: "Judge id not found, Check auth token.",
        success: false,
      });
    }

    // To prevent adding scores in the database whose judge_id is not present
    const checkJudgeIdQuery = `
      SELECT * FROM judges
      WHERE judge_id = $1;
    `;

    const judge = await queryDatabase(checkJudgeIdQuery, [judge_id]);

    if (judge.length == 0 || !judge) {
      return res
        .status(500)
        .json({ message: "Judge does not exists", success: false });
    }

    //To prevent adding scores in the database whose parameter_id is not present
    const checkParameterIdQuery = `
      SELECT * FROM parameters
      WHERE parameter_id = $1;
    `;

    const parameter = await queryDatabase(checkParameterIdQuery, [
      parameter_id,
    ]);

    if (parameter.length == 0 || !parameter) {
      return res
        .status(500)
        .json({ message: "Parameter does not exists", success: false });
    }

    //To prevent adding scores in the database whose team_id is not present
    const checkTeamIdQuery = `
      SELECT * FROM teams
      WHERE team_id = $1;
    `;

    const team = await queryDatabase(checkTeamIdQuery, [team_id]);

    if (team.length == 0 || !team) {
      return res
        .status(500)
        .json({ message: "Team does not exists", success: false });
    }

    //To prevent adding scores in the database whose competition_id is not present
    const checkCompetitionIdQuery = `
      SELECT * FROM competitions
      WHERE competition_id = $1;
    `;

    const competition = await queryDatabase(checkCompetitionIdQuery, [
      competition_id,
    ]);

    if (competition.length == 0 || !competition) {
      return res
        .status(500)
        .json({ message: "Competition does not exists", success: false });
    }

    //To prevent adding duplicate scores in the database
    const alreadyExistQuery = `
      SELECT * FROM scores
      WHERE judge_id = $1 AND team_id = $2 AND parameter_id = $3 AND competition_id = $4;
    `;

    const duplicateScore = await queryDatabase(alreadyExistQuery, [
      judge_id,
      team_id,
      parameter_id,
      competition_id,
    ]);

    if (duplicateScore.length !== 0 || !duplicateScore) {
      return res
        .status(500)
        .json({ message: "Score already exists", success: false });
    }

    //Main query to add score
    const query = `
        INSERT INTO scores ( judge_id, team_id, parameter_id, score_value, competition_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

    const values = [
      judge_id,
      team_id,
      parameter_id,
      score_value,
      competition_id,
    ];

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

export const getAllScores = async (req: Request, res: Response) => {
  try {
    const { competition_id } = req.headers;
    const query = `
      SELECT *
      FROM scores
      WHERE competition_id = $1;
    `;

    const scores = await queryDatabase(query, [competition_id]);

    res.status(200).json({ scores, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching scores:", success: false });
  }
};
