import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  judge_id: string;
  competition_id: string;
  // Add more properties as needed
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Provide a default value because ts is giving error as jwt.verify() is not able to identify the type of JWT_SECRET

const fetchJudge = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const { judge_id, competition_id } = decodedToken;

    // Set the judge details in the request headers for further processing
    req.headers.judge_id = judge_id;
    req.headers.competition_id = competition_id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default fetchJudge;
