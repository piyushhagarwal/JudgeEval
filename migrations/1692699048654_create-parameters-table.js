exports.up = (pgm) => {
  pgm.createTable("parameters", {
    parameter_id: { type: "SERIAL", primaryKey: true },
    parameter_name: { type: "VARCHAR(255)", notNull: true },
    parameter_description: { type: "TEXT" },
    competition_id: {
      type: "INTEGER",
      notNull: true,
      references: "competitions(competition_id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("parameters");
};
