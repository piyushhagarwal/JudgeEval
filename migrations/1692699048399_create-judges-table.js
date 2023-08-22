exports.up = (pgm) => {
  pgm.createTable("judges", {
    judge_id: { type: "SERIAL", primaryKey: true },
    judge_name: { type: "VARCHAR(255)", notNull: true },
    judge_password: { type: "VARCHAR(255)", notNull: true },
    competition_id: {
      type: "INTEGER",
      notNull: true,
      references: "competitions(competition_id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("judges");
};
