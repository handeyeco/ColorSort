import { expect } from 'chai';
import tinycolor from 'tinycolor2';
import ColorSort from '../src/index';

describe('ColorSort', function () {
  it('creates an array of tinycolor objects', function () {
    const input = '#BADA55';
    const cs = new ColorSort(input);
    const result = cs.collection[0] instanceof tinycolor;
    expect(result).to.be.true;
  });
});
