const cassandraConnector = require("./db/cassandra/client");
const cassandraRepository = require("./db/cassandra/repository");
const cassandraServices = require("./services/parsers/cassandra");
const logger = require("./utils/logger");
const dataWriter = require("./utils/dataWriter");

(async function startApp() {

  const client = await cassandraConnector.connect();

  const schema = await cassandraRepository.getSchema(client);

  const parsedSchema = cassandraServices.schemaParser(schema);

  await dataWriter.writeFile("result.json", JSON.stringify(parsedSchema));

  await cassandraConnector.disconnect(client);

  logger.info(`DONE. Check result.json file`);
})();
