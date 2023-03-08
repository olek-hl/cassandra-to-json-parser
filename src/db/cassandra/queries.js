const credentials = require("../../config/config.cassandra");

const { keyspace } = credentials;

const getAllTables = `SELECT table_name FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`;
const getTableSchema = (tableName) =>
  `SELECT column_name, type, kind FROM system_schema.columns WHERE keyspace_name = '${keyspace}' AND table_name = '${tableName}'`;
const getTableFirstRow = (tableName) =>
  `SELECT * FROM ${keyspace}.${tableName} LIMIT 1`;

const getAllTypes = () => `SELECT * FROM system_schema.types WHERE keyspace_name = '${keyspace}'`

module.exports = {
  getAllTables,
  getTableSchema,
  getTableFirstRow,
  getAllTypes,
};
