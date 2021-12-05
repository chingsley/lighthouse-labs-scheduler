const { default: reducer } = require('./application');

describe('reducer', () => {
  it('hrows an error with an unsupported type', () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /Tried to reduce with unsupported action type: null/i
    );
  });
});
