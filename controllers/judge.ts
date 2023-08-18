import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import { Request, Response } from "express";
import queryDatabase from "../database/connection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Provide a default value because ts is giving error as jwt.verify() is not able to identify the type of JWT_SECRET

export const loginJudge = async (req: Request, res: Response) => {
  try {
    const { judge_name, judge_password } = req.body;
    const getUserQuery = `
      SELECT * 
      FROM judges
      WHERE judge_name = $1;
    `;

    let retrieveJudgeArray = await queryDatabase(getUserQuery, [judge_name]); //Whenever we fetch the data from database it comes in an array

    if (!retrieveJudgeArray || retrieveJudgeArray.length === 0) {
      return res
        .status(500)
        .json({ message: "Login with correct username", success: false });
    }

    const retrieveJudge = retrieveJudgeArray[0];

    const passwordCompare = await bcrypt.compare(
      judge_password,
      retrieveJudge.judge_password
    );

    if (!passwordCompare) {
      return res
        .status(500)
        .json({ message: "Login with correct password", success: false });
    }

    const payloadData = {
      judge_id: retrieveJudge.judge_id,
    };

    const authToken = jwt.sign(payloadData, JWT_SECRET);

    res.status(201).json({ success: true, authToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in loging in the judge", success: false });
  }
};

export const createJudge = async (req: Request, res: Response) => {
  try {
    const { judge_name, judge_password } = req.body;
    const getUserQuery = `
      SELECT * 
      FROM judges
      WHERE judge_name = $1;
      `;

    //if user with same email exists already
    let retrieveJudge = await queryDatabase(getUserQuery, [judge_name]);
    if (retrieveJudge.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Sorry the judge with the given name already exists",
      });
    }

    //Hashing the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(judge_password, salt);

    const createJudgeQuery = `
      INSERT INTO judges ( judge_name, judge_password)
      VALUES ($1, $2)
      RETURNING *;
    `;
    let createdJudge = await queryDatabase(createJudgeQuery, [
      judge_name,
      securedPassword,
    ]);

    //Creating the authentication token by using the id of the judge by JWT
    const payloadData = {
      judge_id: createdJudge[0].judge_id,
    };
    const authToken = jwt.sign(payloadData, JWT_SECRET);
    res.status(201).json({ success: true, authToken }); // It means {authToken : authToken}
  } catch (error) {
    res.status(500).json({
      message: "Some error occured while creating an user",
      success: "false",
    });
  }
};

export const getAllJudges = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT *
      FROM judges;
    `;

    const judges = await queryDatabase(query);

    res.status(200).json({ judges, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching judges:", success: false });
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
    res.status(500).json({ message: "Error fetching judge:", success: false });
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
    res.status(500).json({ message: "Error updating judge:", success: false });
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
    res.status(500).json({ message: "Error deleting judge:", success: false });
  }
};
