const credentials = require("../../config/config.cassandra");
const logger = require("../../utils/logger");
const queries = require('../../db/cassandra/queries');

const valdateCredentials = async () => {
    const { hosts, datacenter } = credentials;
    if (!hosts) {
        logger.error('Specify hosts, please.');
        return;
    };
    if (!datacenter) {
        logger.error('Specify datacenter, please.');
        return;
    };
};

const validateKeySpaces = async (client) => {
    const { keyspace } = credentials;
    const keyspaces = await client.execute(queries.getKeyspaces);

    const isKeyspacesMissing = !keyspaces.rows.some(keySpace => keySpace.keyspace_name === keyspace);
    if (isKeyspacesMissing) {
        throw new Error('Keyspace is missing in your cluster. Check, please')
    }
}

module.exports = {
    valdateCredentials,
    validateKeySpaces
}