// 2_create_judges_table.js

exports.up = async (pgm) => {
  await pgm.createTable("judges", {
    judge_id: { type: "serial", primaryKey: true },
    judge_name: { type: "varchar(255)", notNull: true },
    judge_password: { type: "varchar(255)" },
  });
};

exports.down = async (pgm) => {
  await pgm.dropTable("judges");
};
