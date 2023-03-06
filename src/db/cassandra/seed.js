const cassandraConnector = require("./client");

(async function seed() {

    const client = await cassandraConnector.connect();
  
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS cassandra_schemas
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      }
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS cassandra_schemas.data_with_different_types (
        id int PRIMARY KEY,
        name text,
        age int,
        email text,
        phone set<text>,
        address text,
        interests list<text>,
        last_active timestamp,
        score float,
        profile frozen<tuple<text, text>>
      )
    `);

    await client.execute(`INSERT INTO cassandra_schemas.data_with_different_types (id, name, age, email, phone, address, interests, last_active, score, profile) VALUES (1, 'Alice', 25, 'alice@example.com', {'5551234', '5555678'}, '{ "street": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345" }', ['hiking', 'reading', 'gardening'], '2023-03-06T12:00:00Z', 8, ('A', 'F'))`,)

  })();