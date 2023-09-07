// 3_create_parameters_table.js

exports.up = async (pgm) => {
  await pgm.createTable("parameters", {
    parameter_id: { type: "serial", primaryKey: true },
    parameter_name: { type: "varchar(255)", notNull: true },
    parameter_description: { type: "text" },
  });
};

exports.down = async (pgm) => {
  await pgm.dropTable("parameters");
};
