// 1_create_teams_table.js

exports.up = async (pgm) => {
  await pgm.createTable("teams", {
    team_id: { type: "serial", primaryKey: true },
    team_name: { type: "varchar(255)", notNull: true },
    other_team_details: { type: "text" },
  });
};

exports.down = async (pgm) => {
  await pgm.dropTable("teams");
};
