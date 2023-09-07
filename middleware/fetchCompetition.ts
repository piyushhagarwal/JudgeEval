import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  competition_id: string;
  // Add more properties as needed
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const fetchCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("competition-token");

  if (!token) {
    return res.status(401).json({
      message: "Competition token missing",
    });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const { competition_id } = decodedToken;

    req.headers.competition_id = competition_id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default fetchCompetition;
