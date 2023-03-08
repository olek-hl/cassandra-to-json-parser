// index.test.js
const parser = require('../services/parsers/cassandra/index.js');
const cassandraConnector = require("../db/cassandra/client");

describe('Cassandra DB functionality', () => {
    let client;
  
    beforeAll(async () => {
      // Connect to Cassandra database
      client = await cassandraConnector.connect();
    });
  
    afterAll(async () => {
      // Close Cassandra database connection
      await client.shutdown();
    });
  
    test('Insert data into table', async () => {
      const query = `INSERT INTO cassandra_schemas.data_with_different_types (id, name, age, email, phone, address, interests, last_active, score, profile) VALUES (33, 'Jack', 25, 'jack@example.com', {'5551234', '5555678'}, '{ "street": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345" }', ['hiking', 'reading', 'gardening'], '2023-03-06T12:00:00Z', 8, ('A', 'F'))`;
      await client.execute(query, {prepare: true});
      const result = await client.execute('SELECT * FROM  cassandra_schemas.data_with_different_types WHERE id = ?', [33], {prepare: true});
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].id).toBe(33);
      expect(result.rows[0].name).toBe('Jack');
    });
  
    test('Update data in table', async () => {
      const query = 'UPDATE cassandra_schemas.data_with_different_types SET name = ? WHERE id = ?';
      const params = ['Kate', 1];
      await client.execute(query, params, {prepare: true});
      const result = await client.execute('SELECT * FROM cassandra_schemas.data_with_different_types WHERE id = ?', [1], {prepare: true});
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].id).toBe(1);
      expect(result.rows[0].name).toBe('Kate');
    });
  
    test('Delete data from table', async () => {
      const query = 'DELETE FROM cassandra_schemas.data_with_different_types WHERE id = 1';
      const params = [1];
      await client.execute(query, {prepare: true});
      const result = await client.execute('SELECT * FROM cassandra_schemas.data_with_different_types WHERE id = ?', [1], {prepare: true});
      expect(result.rows.length).toBe(0);
    });
  });

describe('Parser functionality', () => {
    test('parse text', () => {
        expect(parser.parsePrimitiveTypes('text')).toEqual({'type': 'string'})
    })

    test('parse int', () => {
        expect(parser.parsePrimitiveTypes('int')).toEqual({'type': 'integer'})
    })

    test('parse varchar', () => {
        expect(parser.parsePrimitiveTypes('varchar')).toEqual({'type': 'string'})
    })

    test('parse map', () => {
        expect(parser.parseComplexTypes('map<int, text>')).toEqual({'type': 'object', 'properties': {'integer':'string'}})
    })

    test('parse list', () => {
        expect(parser.parseComplexTypes('list<int>')).toEqual({'type': 'array', 'items': [{'type': 'integer'}]})
    })

    test('parse set', () => {
        expect(parser.parseComplexTypes('set<text>')).toEqual({'type': 'array', 'items': [{'type': 'string'}]})
    });
});

describe('parseType', () => {
    test('should return the correct data type for a non-serialized JSON column', () => {
      const type = 'text';
      const data = 'hello world';
      const result = parser.parseType(type, data);
      expect(result).toEqual({ type: 'string' });
    });
  
    test('should return the correct data type for a serialized JSON column', () => {
      const type = 'text';
      const data = '{"name": "John", "age": 30}';
      const result = parser.parseType(type, data);
      expect(result).toEqual({
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      });
    });
  
    test('should return the correct data type for an int column', () => {
      const type = 'int';
      const data = 123;
      const result = parser.parseType(type, data);
      expect(result).toEqual({ type: 'integer' });
    });
  
    test('should return the correct data type for a float column', () => {
      const type = 'float';
      const data = 1.23;
      const result = parser.parseType(type, data);
      expect(result).toEqual({ type: 'number' });
    });
  
    test('should return the correct data type for a boolean column', () => {
      const type = 'boolean';
      const data = true;
      const result = parser.parseType(type, data);
      expect(result).toEqual({ type: 'boolean' });
    });
  });
  




