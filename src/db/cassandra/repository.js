const queries = require("./queries");
const logger = require("../../utils/logger");

const executeQuery = async (client, query) => {
  try {
    const result = await client.execute(query);
    return result;
  } catch (error) {
    logger.error(error);
  }
};

const getTableNames = async (client) => {
  const tables = await executeQuery(client, queries.getAllTables);
  const tableNames = [];
  for (const table of tables.rows) {
    tableNames.push(table.table_name);
  }
  logger.info(`Tables in db: ${tableNames.length}`);

  return tableNames;
};

const getTableSchema = async (client, tableName) => {
  logger.info(`Getting ${tableName} table schema...`);

  const schema = await executeQuery(client, queries.getTableSchema(tableName));
  return schema.rows.map((col) => ({
    name: col.column_name,
    type: col.type,
    kind: col.kind,
  }));
};

const getTableFirstRowData = async (client, tableName) => {
  logger.info(`Getting ${tableName} table data...`);

  const firstRowData = await executeQuery(
    client,
    queries.getTableFirstRow(tableName)
  );
  return firstRowData.rows[0];
};

const getSchema = async (client) => {
  const tableNames = await getTableNames(client);
  const tableData = {};
  for (const table of tableNames) {
    const tableSchema = await getTableSchema(client, table);
    const tableFirstRowData = await getTableFirstRowData(client, table);
    tableData[table] = {
      schema: tableSchema,
      data: tableFirstRowData,
    };
  }
  return tableData;
};

module.exports = {
  getSchema,
  executeQuery
};
