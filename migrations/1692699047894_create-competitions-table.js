exports.up = (pgm) => {
  pgm.createTable("competitions", {
    competition_id: { type: "SERIAL", primaryKey: true },
    competition_name: { type: "VARCHAR(255)", notNull: true },
    competition_password: { type: "VARCHAR(255)", notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("competitions");
};
