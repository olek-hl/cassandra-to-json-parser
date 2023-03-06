// index.test.js
const parser = require('./src/services/parsers/cassandra/index.js');

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
})


