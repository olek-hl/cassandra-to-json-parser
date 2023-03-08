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
  const { schema, data, udt } = tableData;

  const JSONSchema = {
    $schema: JSON_SCHEMA_VERSION,
    type: "object",
    title: tableName,
    properties: {},
  };

  schema.forEach((column, i) => {
    const { type, name } = column;
    JSONSchema.properties[name] = parseType(type, data[name], udt);
  });

  return JSONSchema;
};

const parseType = (type, data, udt) => {

  const isColumnSerializedJson =
    type === "text" && helpers.isTextSerializedJSON(data);
    
  const parseSerializeText = (data) => {
    const parsedData = JSON.parse(data);

    return Object.keys(parsedData).reduce((acc, curr) => {
      const nestedType = typeof parsedData[curr];
      const isObject = nestedType === 'object';
      return {
        ...acc,
        [curr]: {
          type: isObject ? 'object' : nestedType,
          ...(isObject && parseType('text', JSON.stringify(parsedData[curr])))
        },
      };
    }, {});
  };

  return isColumnSerializedJson
    ? {
        type: 'object',
        properties: parseSerializeText(data)
      }
    : {
        ...parsePrimitiveTypes(type, udt),
      };
};

const parsePrimitiveTypes = (type, udt) => {
  const _type = typeHelpers.removeFrozen(type);
  const isPrimitive = typeHelpers.inPrimitiveType(_type) && !udt?.some(type => type.type_name === _type);
  return isPrimitive
    ? {
        type: typeHelpers.typeMapping[_type],
      }
    : {
        ...parseComplexTypes(_type, udt),
      };
};

const parseComplexTypes = (type, udt) => {
  const mainType = type.split("<")[0];

  const nestedType = type.replace(`${mainType}<`, '').replace(/\>$/, '');
  const isNestedPrimitives = nestedType.indexOf('<') < 0;
  const UDTdata = udt?.find(udtType => udtType.type_name === type);

  if (Boolean(UDTdata)) {
    return {
      type: 'object',
      properties: UDTdata.field_names.reduce((acc, curr, i) => {
        return {
          ...acc,
          [curr]: {
            type: UDTdata.field_types[i]
          }
        }
      }, {})
    }
  };

  const getNestedItemsConfig = (nestedTypes) => {
    if (isNestedPrimitives) {
      return nestedTypes.split(', ').reduce(
        (acc, _type) => [...acc, { type: typeHelpers.typeMapping[_type] }],
        []
      )
    } else {
      return parseComplexTypes(nestedTypes)
    }
  }
  
  const getNestedPropertiesConfig = (nestedTypes) => {
    if (isNestedPrimitives) {
      const nestedMapProperties = nestedTypes.split(',')?.map(_t=>typeHelpers.typeMapping[_t.trim()]);
      return Object.fromEntries([nestedMapProperties]);
    } else {
      return parseComplexTypes(nestedTypes);
    }
  };

  const isMap = mainType === "map";
  return {
    type: typeHelpers.typeMapping[mainType],
    [isMap ? "properties" : "items"]: isMap ? getNestedPropertiesConfig(nestedType) : getNestedItemsConfig(nestedType),
  };
};

module.exports = {
  schemaParser,
  parseComplexTypes,
  parsePrimitiveTypes,
  parseType
};
