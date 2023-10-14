import express from "express";
import queryDatabase from "./database/connection";

const app = express();
const port = process.env.PORT || 3000;

import JudgeRouter from "./routes/judge";
import TeamRouter from "./routes/teams";
import ParameterRouter from "./routes/parameters";
import ScoreRouter from "./routes/score";
import CompetitionRouter from "./routes/competition";
import ResultRouter from "./routes/result";

import { notFound } from "./middleware/notFound";

app.use(express.json());

//Routes

app.use("/api/v1/judge", JudgeRouter);
app.use("/api/v1/team", TeamRouter);
app.use("/api/v1/parameter", ParameterRouter);
app.use("/api/v1/score", ScoreRouter);
app.use("/api/v1/competition", CompetitionRouter);
app.use("/api/v1/result", ResultRouter);

app.use(notFound);

const start = async () => {
  try {
    await queryDatabase("SELECT 1"); // A simple query to test the connection
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
