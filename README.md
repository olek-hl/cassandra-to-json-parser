# Cassandra DB Table to JSON Schema Converter

This project provides a command-line tool to convert Cassandra database table schemas to JSON schemas. The tool generates a JSON schema for each table in the specified Cassandra database and writes it to a file.

## Getting Started

Cassandra: 3.11.13
Java "8.0_362"

To use this tool, you will need to have Node.js installed on your system. Once Node.js is installed, you can clone this repository and install the required dependencies by running the following commands:


1. `npm i`

2. Fill a credentials file: `src/config/config.cassandra.js`

```
{
  hosts,
  datacenter,
  keyspace,
  username,
  password,
  secureConnectBundle // for remote db
}

```

3. If you need some data, just run `npm run seed`

4. `npm run start`
