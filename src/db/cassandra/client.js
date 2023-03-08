const cassandra = require("cassandra-driver");
const credentials = require("../../config/config.cassandra");
const logger = require("../../utils/logger");

const getClient = async () => {
  let client;
  const { username, password, hosts, datacenter, secureConnectBundle } = credentials;

  const isCloudClient = Boolean(secureConnectBundle);

  const authProvider = new cassandra.auth.PlainTextAuthProvider(username, password);
  const contactPoints = hosts.map((item) => `${item.host}:${item.port}`);

  if (isCloudClient) {
    client = new cassandra.Client({
      cloud: {
        secureConnectBundle,
      },
      credentials: { username, password },
    });
  } else {
    client = new cassandra.Client({
      contactPoints,
      authProvider: authProvider,
      localDataCenter: datacenter,
    });
  };

  return client;
};

const connect = async (client) => {
  try {
    await client.connect();
    logger.info("Connected to Cassandra");
    return client;
  } catch (error) {
    logger.error(error);
  }
};

const disconnect = async (client) => {
  client.shutdown();
};

module.exports = {
  getClient,
  connect,
  disconnect,
};
