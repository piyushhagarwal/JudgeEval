CREATE TABLE competitions (
    competition_id SERIAL PRIMARY KEY,
    competition_name VARCHAR(255) NOT NULL,
    competition_password VARCHAR(255) NOT NULL
);

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    other_team_details TEXT,
    competition_id INTEGER NOT NULL,
    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id) ON DELETE CASCADE
);

CREATE TABLE judges (
    judge_id SERIAL PRIMARY KEY,
    judge_name VARCHAR(255) NOT NULL,
    judge_password VARCHAR(255) NOT NULL,
    competition_id INTEGER NOT NULL,
    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id) ON DELETE CASCADE
);

CREATE TABLE parameters (
    parameter_id SERIAL PRIMARY KEY,
    parameter_name VARCHAR(255) NOT NULL,
    parameter_description TEXT,
    competition_id INTEGER NOT NULL,
    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id) ON DELETE CASCADE
);

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    judge_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    parameter_id INTEGER NOT NULL,
    score_value INTEGER NOT NULL,
    competition_id INTEGER NOT NULL,
    FOREIGN KEY (judge_id) REFERENCES judges(judge_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (parameter_id) REFERENCES parameters(parameter_id) ON DELETE CASCADE,
    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id) ON DELETE CASCADE
);
