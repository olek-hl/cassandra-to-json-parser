const cassandraCredentials = {
    hosts: [{ host: "127.0.0.1", port: "9042" }], // cassandra db hosts
    datacenter: "datacenter1", // cassandra db datacenter,
    keyspace: "cassandra_schemas",
    username: "cassandra", // username
    password: "cassandra", // password,
    secureConnectBundle: '',
  };
  
  module.exports = cassandraCredentials;
  