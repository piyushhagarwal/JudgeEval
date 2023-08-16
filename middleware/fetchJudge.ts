import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  judgeId: string;
  // Add more properties as needed
}

const JWT_SECRET = "oursecret";

function fetchJudge() {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("auth-token");

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

      const { judgeId } = decodedToken;

      // Set the judge details in the request headers for further processing
      req.headers.judgeId = judgeId;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

export default fetchJudge;
