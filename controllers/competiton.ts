import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import { Request, Response } from "express";
import queryDatabase from "../database/connection";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const createCompetition = async (req: Request, res: Response) => {
  const { competition_name } = req.body;

  try {
    const getCompetitionQuery = `
        SELECT * 
        FROM competitions
        WHERE competition_name = $1;
    `;

    //if competition already exists
    let retrieveCompetition = await queryDatabase(getCompetitionQuery, [
      competition_name,
    ]);
    if (retrieveCompetition.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Sorry, Competition with given name already exists!",
      });
    }

    const createCompetitionQuery = `
        INSERT INTO competitions ( competition_name )
        VALUES ($1)
        RETURNING *;
      `;

    let createdCompetition = await queryDatabase(createCompetitionQuery, [
      competition_name,
    ]);

    const payloadData = {
      competition_id: createdCompetition.competition_id,
    };
    const authToken = jwt.sign(payloadData, JWT_SECRET);
    res.status(201).json({ success: true, authToken });
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: "Some error occured while creating competition",
    });
  }
};

export const getAllCompetitions = async (req: Request, res: Response) => {
  try {
    const query = `
        SELECT *
        FROM competitions;
      `;

    const competitions = await queryDatabase(query);

    res.status(200).json({ competitions, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching competitions:", success: false });
  }
};
