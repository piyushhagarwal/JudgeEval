import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const getOverallResult = async (req: Request, res: Response) => {
  try {
    const { competition_id } = req.headers;

    const getOverallResultQuery = `
        SELECT
        sub.team_id,
        sub.team_name,
        AVG(sub.avg_parameter_score) AS final_avg_score
        FROM (
        SELECT
            t.team_id,
            t.team_name,
            AVG(s.score_value) AS avg_parameter_score
        FROM teams t
        JOIN scores s ON t.team_id = s.team_id
        JOIN parameters p ON s.parameter_id = p.parameter_id
        WHERE t.competition_id = $1
        GROUP BY t.team_id, t.team_name, p.parameter_name
        ) AS sub
        GROUP BY sub.team_id, sub.team_name
        ORDER BY sub.team_id;
    `;

    let retrieveResults = await queryDatabase(getOverallResultQuery, [
      competition_id,
    ]);

    res.status(200).json({ result: retrieveResults, success: true });
  } catch (error) {
    res.status(500).json({
      message: "There was an error in fetching in results",
      success: false,
    });
  }
};

export const getParameterWiseScores = async (req: Request, res: Response) => {
  try {
    const { competition_id } = req.headers;

    const getParameterWiseScoresQuery = `
        SELECT
        t.team_id,
        t.team_name,
        p.parameter_name,
        AVG(s.score_value) AS avg_parameter_score
        FROM teams t
        JOIN scores s ON t.team_id = s.team_id
        JOIN parameters p ON s.parameter_id = p.parameter_id
        WHERE t.competition_id = $1
        GROUP BY t.team_id, t.team_name, p.parameter_name
      `;

    let retrieveScores = await queryDatabase(getParameterWiseScoresQuery, [
      competition_id,
    ]);

    res.status(200).json({ scores: retrieveScores, success: true });
  } catch (error) {
    res.status(500).json({
      message: "There was an error in fetching in scores",
      success: false,
    });
  }
};

export const getparameterResult = async (req: Request, res: Response) => {
  try {
    const { competition_id } = req.headers;

    const getParameterResultQuery = `
        SELECT
        t.team_id,
        t.team_name,
        p.parameter_name,
        AVG(s.score_value) AS avg_parameter_score
        FROM teams t
        JOIN scores s ON t.team_id = s.team_id
        JOIN parameters p ON s.parameter_id = p.parameter_id
        WHERE t.competition_id = $1
        GROUP BY t.team_id, t.team_name, p.parameter_name
        HAVING AVG(s.score_value) = (
            SELECT MAX(avg_parameter_score)
            FROM (
                SELECT
                    t.team_id,
                    p.parameter_name,
                    AVG(s.score_value) AS avg_parameter_score
                FROM teams t
                JOIN scores s ON t.team_id = s.team_id
                JOIN parameters p ON s.parameter_id = p.parameter_id
                GROUP BY t.team_id, p.parameter_name
            ) AS sub
        WHERE sub.parameter_name = p.parameter_name
  );
 `;

    let retrieveResults = await queryDatabase(getParameterResultQuery, [
      competition_id,
    ]);

    res.status(200).json({ result: retrieveResults, success: true });
  } catch (error) {
    res.status(500).json({
      message: "There was an error in fetching in parameter based results",
      success: false,
    });
  }
};
