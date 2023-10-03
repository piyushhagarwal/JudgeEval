import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import { Request, Response } from "express";
import queryDatabase from "../database/connection";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const createCompetition = async (req: Request, res: Response) => {
  const { competition_name, competition_password } = req.body;

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

    //Hashing the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(competition_password, salt);

    const createCompetitionQuery = `
        INSERT INTO competitions ( competition_name, competition_password )
        VALUES ($1, $2)
        RETURNING *;
      `;

    let createdCompetition = await queryDatabase(createCompetitionQuery, [
      competition_name,
      securedPassword,
    ]); //Return an array

    const payloadData = {
      competition_id: createdCompetition[0].competition_id,
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

export const loginCompetition = async (req: Request, res: Response) => {
  try {
    const { competition_name, competition_password } = req.body;
    const getCompetitionQuery = `
      SELECT * 
      FROM competitions
      WHERE competition_name = $1;
  `;
    let retrieveCompetitionArray = await queryDatabase(getCompetitionQuery, [
      competition_name,
    ]); //Whenever we fetch the data from database it comes in an array

    if (!retrieveCompetitionArray || retrieveCompetitionArray.length === 0) {
      return res.status(500).json({
        message: "Login with correct Competition Name",
        success: false,
      });
    }

    const retrieveCompetition = retrieveCompetitionArray[0];

    const passwordCompare = await bcrypt.compare(
      competition_password,
      retrieveCompetition.competition_password
    );

    if (!passwordCompare) {
      return res
        .status(500)
        .json({ message: "Login with correct password", success: false });
    }
    const payloadData = {
      competition_id: retrieveCompetition.competition_id,
    };

    const authToken = jwt.sign(payloadData, JWT_SECRET);

    res.status(201).json({ success: true, authToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in logging in the competition", success: false });
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

export const deleteCompetition = async (req: Request, res: Response) => {
  try {
    const competitionId = req.params.id; // Assuming the judge ID is passed as a parameter

    const query = `
      DELETE FROM competitions
      WHERE competition_id = $1
      RETURNING *;
    `;

    const values = [competitionId];

    const deletedCompetition = await queryDatabase(query, values);

    if (deletedCompetition.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Competition not found" });
    }

    res.status(200).json({ competition: deletedCompetition[0], success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Competition:", success: false });
  }
};
