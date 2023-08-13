CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255),
    other_team_details TEXT
);

CREATE TABLE judges (
    judge_id SERIAL PRIMARY KEY,
    judge_name VARCHAR(255),
    other_judge_details TEXT
);

CREATE TABLE parameters (
    parameter_id SERIAL PRIMARY KEY,
    parameter_name VARCHAR(255),
    parameter_description TEXT
);

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    judge_id SERIAL,
    team_id SERIAL,
    parameter_id SERIAL,
    score_value DECIMAL(5, 2),
    FOREIGN KEY (judge_id) REFERENCES judges(judge_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (parameter_id) REFERENCES parameters(parameter_id)
);