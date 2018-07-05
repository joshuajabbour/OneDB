const expect = require('chai').expect;
const util = require('../lib/util');

describe('Util', () => {
  it('should encode document', () => {
    const schema = {
      foo: 'bar',
      $ref: 'abc',
      'foo.bar': 'baz',
      nested: {
        'a.b': 'qux',
      },
      array: [{
        $ref: 'def',
      }]
    };
    const encoded = util.encodeDocument(schema);
    expect(encoded).to.deep.equal({
      foo: 'bar',
      '\uFF04ref': 'abc',
      'foo\uFF0Ebar': 'baz',
      nested: {
        'a\uFF0Eb': 'qux',
      },
      array: [{
        '\uFF04ref': 'def',
      }]
    });
    const decoded = util.decodeDocument(encoded);
    expect(decoded).to.deep.equal(schema);
  })
})