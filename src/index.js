const cassandraConnector = require("./db/cassandra/client");
const cassandraRepository = require("./db/cassandra/repository");
const cassandraServices = require("./services/parsers/cassandra");
const logger = require("./utils/logger");
const dataWriter = require("./utils/dataWriter");
const validator = require('./services/validator');

(async function startApp() {

  await validator.valdateCredentials();

  try {
    const client = await cassandraConnector.connect();

    await validator.validateKeySpaces(client);
  
    const schema = await cassandraRepository.getSchemas(client);
  
    const parsedSchema = cassandraServices.schemaParser(schema);
  
    await dataWriter.writeFile("result.json", JSON.stringify(parsedSchema));
  
    await cassandraConnector.disconnect(client);
  
    logger.info(`DONE. Check result.json file`);
  } catch (e) {
    logger.error(e);
  }
})();
