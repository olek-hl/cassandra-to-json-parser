const credentials = require("../../config/config.cassandra");
const logger = require("../../utils/logger");

const valdateCredentials = async (client) => {
    const { hosts, datacenter, keyspace } = credentials;
    if (!hosts) {
        logger.error('Specify hosts, please.');
        return;
    };
    if (!datacenter) {
        logger.error('Specify datacenter, please.');
        return;
    };

    const keyspaces = await client.execute('SELECT keyspace_name FROM system_schema.keyspaces');

    const isKeyspacesMissing = keyspaces.rows.findIndex(keySpace => keySpace.keyspace_name === keyspace) > 0;
    if (isKeyspacesMissing) {
        throw new Error('Keyspace is missing in your cluster. Check, please')
    }
};

module.exports = {
    valdateCredentials
}