const cassandraConnector = require("./client");

(async function seed() {

    const client = await cassandraConnector.connect();

    const udtFields = ['name', 'age', 'email'];

    const createUDTQuery = `CREATE TYPE IF NOT EXISTS cassandra_schema_data_types.friends (${udtFields.join(' text, ')} text)`;
  
    await client.execute(createUDTQuery);

    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS cassandra_schema_data_types
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      }
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS cassandra_schema_data_types.data_with_different_types (
        id int PRIMARY KEY,
        name text,
        age int,
        email text,
        phone set<text>,
        address text,
        interests list<text>,
        last_active timestamp,
        score float,
        friends_contact_info frozen<friends>
      )
    `);

    const address = JSON.stringify({
      street: "123 Main St",
      city: "Zhytomyr",
      location: {
        x: {
          up: 33,
          down: 44
        },
        y: 3
      }
    });

    const friends = JSON.stringify({
      name: "Jack",
      age: 30, 
      email: 'jack@example.com'
    });

    await client.execute(`INSERT INTO cassandra_schema_data_types.data_with_different_types (id, name, age, email, phone, address, interests, last_active, score, friends_contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, 'Alice', 25, 'alice@example.com', ['5551234', '5555678'], `${address}`, ['hiking', 'reading', 'gardening'], '2023-03-06T12:00:00Z', 8, `${friends}`], {prepare: true})

  })();