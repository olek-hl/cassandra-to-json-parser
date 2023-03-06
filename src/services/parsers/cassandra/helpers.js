const typeMapping = {
    ascii: "string",
    bigint: "integer",
    blob: "string",
    boolean: "boolean",
    counter: "integer",
    date: "string",
    decimal: "number",
    double: "number",
    float: "number",
    inet: "string",
    int: "integer",
    list: "array",
    map: "object",
    set: "array",
    smallint: "integer",
    text: "string",
    time: "string",
    timestamp: "string",
    timeuuid: "string",
    tinyint: "integer",
    tuple: "array",
    udt: "object",
    uuid: "string",
    varchar: "string",
    varint: "integer",
    duration: "string",
  };
  
  const removeFrozen = (str) => {
    return str.replace(/frozen\<(.*)\>/i, "$1");
  };
  
  const getNestedTypes = (str) => {
    return str.replace(/.*\<(.*)\>/i, "$1").split(", ");
  };
  
  const inPrimitiveType = (type) => {
    return /^[a-zA-Z]+$/.test(type);
  };
  
  module.exports = {
    typeMapping,
    removeFrozen,
    inPrimitiveType,
    getNestedTypes,
  };
  