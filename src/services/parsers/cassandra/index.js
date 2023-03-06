const helpers = require("../../../helpers");
const typeHelpers = require("./helpers");
const logger = require("../../../utils/logger");
const { JSON_SCHEMA_VERSION } = require("./common/constants");

const schemaParser = (tables) => {
  logger.info(`Converting...`);

  const parsedSchemas = [];
  try {
    const tableNames = Object.keys(tables);
    for (const table of tableNames) {
      parsedSchemas.push(parseTable(table, tables[table]));
    }
  
    return parsedSchemas;
  } catch (error) {
    logger.error(`Unexpected error. Check your kayspace, please. Error: ${error}`)
  }

};

const parseTable = (tableName, tableData) => {
  const { schema, data } = tableData;

  const JSONSchema = {
    $schema: JSON_SCHEMA_VERSION,
    type: "object",
    title: tableName,
    properties: {},
  };

  schema.forEach((column, i) => {
    const { type, name } = column;
    JSONSchema.properties[name] = parseType(type, data[name]);
  });

  return JSONSchema;
};

const parseType = (type, data) => {
  const isColumnSerializedJson =
    type === "text" && helpers.isTextSerializedJSON(data);
  const getSerializeTextProperties = (data) => {
    const parsedData = JSON.parse(data);
    return Object.keys(parsedData).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          type: typeof parsedData[curr],
        },
      };
    }, {});
  };

  return isColumnSerializedJson
    ? {
        type: "object",
        properties: getSerializeTextProperties(data),
      }
    : {
        ...parsePrimitiveTypes(type),
      };
};

const parsePrimitiveTypes = (type) => {
  const _type = typeHelpers.removeFrozen(type);
  const isPrimitive = typeHelpers.inPrimitiveType(_type);
  return isPrimitive
    ? {
        type: typeHelpers.typeMapping[_type],
      }
    : {
        ...parseComplexTypes(_type),
      };
};

const parseComplexTypes = (type) => {
  const mainType = type.split("<")[0];
  const nestedTypes = typeHelpers
    .getNestedTypes(type)
    .map((t) => typeHelpers.typeMapping[t]);

  const nestedItems = nestedTypes.reduce(
    (acc, _type) => [...acc, { type: _type }],
    []
  );
  const nestedProperties = Object.fromEntries([nestedTypes]);

  const isMap = mainType === "map";
  return {
    type: typeHelpers.typeMapping[mainType],
    [isMap ? "properties" : "items"]: isMap ? nestedProperties : nestedItems,
  };
};

module.exports = {
  schemaParser,
  parseComplexTypes,
  parsePrimitiveTypes,
  parseType
};
