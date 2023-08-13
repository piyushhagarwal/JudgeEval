import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const getAllJudges = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT *
      FROM judges;
    `;

    const judges = await queryDatabase(query);

    res.status(200).json({ judges, success: true });
  } catch (error) {
    console.error("Error fetching judges:", error);
    res.status(500).json({ error, success: false });
  }
};

export const getSingleJudge = async (req: Request, res: Response) => {
  try {
    const judgeId = req.params.id;

    const query = `
      SELECT *
      FROM judges
      WHERE judge_id = $1;
    `;

    const judge = await queryDatabase(query, [judgeId]);

    if (judge.length === 0) {
      res.status(404).json({ message: "Judge not found", success: false });
    } else {
      res.status(200).json({ judge: judge[0], success: true });
    }
  } catch (error) {
    console.error("Error fetching judge:", error);
    res.status(500).json({ error, success: false });
  }
};

export const createJudge = async (req: Request, res: Response) => {
  try {
    const { judge_name, other_judge_details } = req.body;

    const query = `
      INSERT INTO judges ( judge_name, other_judge_details)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [judge_name, other_judge_details];

    const newJudge = await queryDatabase(query, values);

    res.status(201).json({ judge: newJudge[0], success: true });
  } catch (error) {
    console.error("Error creating judge:", error);
    res.status(500).json({ error, success: false });
  }
};

export const updateJudge = async (req: Request, res: Response) => {
  try {
    const judgeId = req.params.id;
    const { judge_name, other_judge_details } = req.body;

    const query = `
      UPDATE judges
      SET judge_name = COALESCE($1, judge_name), other_judge_details = COALESCE($2, other_judge_details)
      WHERE judge_id = $3
      RETURNING *;
    `;
    //The COALESCE function is used in the UPDATE query to conditionally update only the non-null values passed in the request. This means if a value is provided in the request body, it will be updated, otherwise, the existing value will be retained.

    const values = [judge_name, other_judge_details, judgeId];

    const updatedJudge = await queryDatabase(query, values);

    if (updatedJudge.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Judge not found" });
    }

    res.status(200).json({ judge: updatedJudge[0], success: true });
  } catch (error) {
    console.error("Error updating judge:", error);
    res.status(500).json({ error, success: false });
  }
};

export const deleteJudge = async (req: Request, res: Response) => {
  try {
    const judgeId = req.params.id; // Assuming the judge ID is passed as a parameter

    const query = `
      DELETE FROM judges
      WHERE judge_id = $1
      RETURNING *;
    `;

    const values = [judgeId];

    const deletedJudge = await queryDatabase(query, values);

    if (deletedJudge.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Judge not found" });
    }

    res.status(200).json({ judge: deletedJudge[0], success: true });
  } catch (error) {
    console.error("Error deleting judge:", error);
    res.status(500).json({ error, success: false });
  }
};
