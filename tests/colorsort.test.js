/* global describe, it  */
/* eslint func-names: ["off"], prefer-arrow-callback: ["off"], no-unused-expressions: ["off"] */

import { expect } from 'chai';
import tinycolor from 'tinycolor2';
import ColorSort from '../src/index';

describe('ColorSort constructor core', function () {
  it('creates an array of tinycolor objects', function () {
    const input = '#BADA55';
    const cs = new ColorSort(input);
    const result = cs.entries[0] instanceof tinycolor;
    expect(result).to.be.true;
  });

  it('disregards non-color text', function () {
    const input = '#FF0000 and #00FF00 are complementary colors';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(2);
  });

  it('separates adjacent color text', function () {
    const input = '#FF0000#00FF00#0000FF';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(3);
  });
});

describe('ColorSort constructor input types', function () {
  it('accepts 3-digit hex values', function () {
    const input = '#BAD';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts 4-digit hex values', function () {
    const input = '#BAD';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts 6-digit hex values', function () {
    const input = '#BAD';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts 8-digit hex values', function () {
    const input = '#BAD';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts rgb integer values', function () {
    const input = 'rgb(255, 0, 153)';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts rgb percentage values', function () {
    const input = 'rgb(100%, 0%, 60%)';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts rgba integer values', function () {
    const input = 'rgb(255, 0, 153, 1)';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts rgba percentage values', function () {
    const input = 'rgb(100%, 0%, 60%, 100%)';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts hsl values', function () {
    const input = 'hsl(270,60%,70%)';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });

  it('accepts hsla values', function () {
    const input = 'hsla(240, 100%, 50%, 1)';
    const cs = new ColorSort(input);
    expect(cs.entries).to.have.lengthOf(1);
  });
});

describe('ColorSort.sort() single sort', function () {
  const input = '#ffaa00 #00ffaa #aa00ff';
  const cs = new ColorSort(input);

  it('defaults to sorting red -> green -> blue descending', function () {
    const result = cs.sort();
    const expected = ['#ffaa00', '#aa00ff', '#00ffaa'];
    expect(result.formattedValues()).to.deep.equal(expected);
  });

  it('accepts string input', function () {
    const result = cs.sort('green');
    const expected = ['#00ffaa', '#ffaa00', '#aa00ff'];
    expect(result.formattedValues()).to.deep.equal(expected);
  });

  it('accepts array input', function () {
    const result = cs.sort([{ sort: 'blue' }]);
    const expected = ['#aa00ff', '#00ffaa', '#ffaa00'];
    expect(result.formattedValues()).to.deep.equal(expected);
  });

  it('can sort by ascending', function () {
    const result = cs.sort([{ sort: 'red', asc: true }]);
    const expected = ['#00ffaa', '#aa00ff', '#ffaa00'];
    expect(result.formattedValues()).to.deep.equal(expected);
  });
});

describe('ColorSort.sort() mutiple sort', function () {
  const input = '#ffffaa #aaaa00 #ffaa00 #ff0000';
  const cs = new ColorSort(input);

  it('can accept multiple sort criteria', function () {
    const result = cs.sort([{ sort: 'red' }, { sort: 'green' }]);
    const expected = ['#ffffaa', '#ffaa00', '#ff0000', '#aaaa00'];
    expect(result.formattedValues()).to.deep.equal(expected);
  });

  it('can accept multiple asc criteria', function () {
    const result = cs.sort([{ sort: 'red' }, { sort: 'green', asc: true }]);
    const expected = ['#ff0000', '#ffaa00', '#ffffaa', '#aaaa00'];
    expect(result.formattedValues()).to.deep.equal(expected);
  });
});

describe('ColorSort.formattedValues()', function () {
  const cs = new ColorSort('#000000 rgb(170, 170, 170) hsl(0, 0%, 100%)');

  it('formattedValues() returns an array of hex values', function () {
    const result = cs.formattedValues('hex');
    const expected = ['#000000', '#aaaaaa', '#ffffff'];
    expect(result).to.have.deep.members(expected);
  });

  it('formattedValues(\'hex\') returns an array of hex values', function () {
    const result = cs.formattedValues('hex');
    const expected = ['#000000', '#aaaaaa', '#ffffff'];
    expect(result).to.have.deep.members(expected);
  });

  it('formattedValues(\'rgb\') returns an array of rgb values', function () {
    const result = cs.formattedValues('rgb');
    const expected = ['rgb(0, 0, 0)', 'rgb(170, 170, 170)', 'rgb(255, 255, 255)'];
    expect(result).to.have.deep.members(expected);
  });

  it('formattedValues(\'hsl\') returns an array of hsl values', function () {
    const result = cs.formattedValues('hsl');
    const expected = ['hsl(0, 0%, 0%)', 'hsl(0, 0%, 67%)', 'hsl(0, 0%, 100%)'];
    expect(result).to.have.deep.members(expected);
  });
});

describe('ColorSort.removeDuplicates()', function () {
  it('remove duplicate colors', function () {
    const input = '#000000 #000000 #FFFFFF';
    const cs = new ColorSort(input).removeDuplicates();
    expect(cs.entries).to.have.lengthOf(2);
  });

  it('distinguish between opacities', function () {
    const input = 'rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 1)';
    const cs = new ColorSort(input).removeDuplicates();
    expect(cs.entries).to.have.lengthOf(2);
  });
});
