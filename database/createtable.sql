CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255),
    other_team_details TEXT
);

CREATE TABLE judges (
    judge_id SERIAL PRIMARY KEY,
    judge_name VARCHAR(255),
    judge_password VARCHAR(255)
);

CREATE TABLE parameters (
    parameter_id SERIAL PRIMARY KEY,
    parameter_name VARCHAR(255),
    parameter_description TEXT
);

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    judge_id INTEGER,
    team_id INTEGER,
    parameter_id INTEGER,
    score_value INTEGER,
    FOREIGN KEY (judge_id) REFERENCES judges(judge_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (parameter_id) REFERENCES parameters(parameter_id) ON DELETE CASCADE   
);