exports.up = (pgm) => {
  pgm.createTable("teams", {
    team_id: { type: "SERIAL", primaryKey: true },
    team_name: { type: "VARCHAR(255)", notNull: true },
    other_team_details: { type: "TEXT" },
    competition_id: {
      type: "INTEGER",
      notNull: true,
      references: "competitions(competition_id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("teams");
};
