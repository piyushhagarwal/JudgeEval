// 4_create_scores_table.js

exports.up = async (pgm) => {
  await pgm.createTable("scores", {
    score_id: { type: "serial", notNull: true, primaryKey: true },
    judge_id: {
      type: "integer",
      notNull: true,
      references: "judges",
      onDelete: "CASCADE",
    },
    team_id: {
      type: "integer",
      notNull: true,
      references: "teams",
      onDelete: "CASCADE",
    },
    parameter_id: {
      type: "integer",
      notNull: true,
      references: "parameters",
      onDelete: "CASCADE",
    },
    score_value: { type: "integer", notNull: true },
  });
};

exports.down = async (pgm) => {
  await pgm.dropTable("scores");
};
