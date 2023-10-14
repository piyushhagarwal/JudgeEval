exports.up = (pgm) => {
  pgm.createTable("scores", {
    score_id: { type: "SERIAL", primaryKey: true },
    judge_id: {
      type: "INTEGER",
      notNull: true,
      references: "judges(judge_id)",
      onDelete: "CASCADE",
    },
    team_id: {
      type: "INTEGER",
      notNull: true,
      references: "teams(team_id)",
      onDelete: "CASCADE",
    },
    parameter_id: {
      type: "INTEGER",
      notNull: true,
      references: "parameters(parameter_id)",
      onDelete: "CASCADE",
    },
    score_value: { type: "INTEGER", notNull: true },
    competition_id: {
      type: "INTEGER",
      notNull: true,
      references: "competitions(competition_id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("scores");
};
