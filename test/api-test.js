var expect    = require('chai').expect;
var s = require('../main.js');
var data = require('./test-data.js');

describe('** Space defn validator functions ******************* ', () => {
  
  it('validate_viewports_attributes catches malformed viewports definitions', () => { 
    expect(s.validate_viewports_attributes([])).to.be.false;
    expect(s.validate_viewports_attributes(null)).to.be.false;
    expect(s.validate_viewports_attributes(undefined)).to.be.false;
    expect(s.validate_viewports_attributes({})).to.be.false;
    expect(s.validate_viewports_attributes({'defaults': {}})).to.be.false;
    expect(s.validate_viewports_attributes({'foo': {}, 'defaults': {}})).to.be.true;
    expect(s.validate_viewports_attributes({'foo': { 'sizepx': [10,10] }})).to.be.true;
  });

  it('validate_windows_attributes catches malformed windows definitions', () => { 
    expect(s.validate_windows_attributes([], [])).to.be.false;
    expect(s.validate_windows_attributes(null, undefined)).to.be.false;
    expect(s.validate_windows_attributes(undefined, {})).to.be.false;
    expect(s.validate_windows_attributes(undefined, 'foo')).to.be.false;
    expect(s.validate_windows_attributes('bar')).to.be.false;
    expect(s.validate_windows_attributes({}, [])).to.be.false;
    expect(s.validate_windows_attributes({'defaults': {}}, {'a': {}})).to.be.false;
    expect(s.validate_windows_attributes({'win': {}})).to.be.false;
    expect(s.validate_windows_attributes({'win': {}}, {})).to.be.false;
    expect(s.validate_windows_attributes({'win': { 'sizepx': [10,10] }},
      {'foo': {}})).to.be.false;
    expect(s.validate_windows_attributes(
      {'win': { 'sizepx': [10,10], 'viewports': ['foo'] }},
      {'bar': {}})).to.be.false;
    expect(s.validate_windows_attributes(
      {'win': { 'sizepx': [10,10], 'viewports': 'foo' }},
      {'bar': {}})).to.be.false;
    expect(s.validate_windows_attributes(
      {'win': { 'sizepx': [10,10], 'viewports': [] }},
      {'bar': {}})).to.be.false;
    expect(s.validate_windows_attributes(
      {'win': { 'sizepx': [10,10], 'viewports': false }},
      {'bar': {}})).to.be.false;
    expect(s.validate_windows_attributes(
      {'win': { 'sizepx': [10,10], 'viewports': null }},
      {'bar': {}})).to.be.false;
    expect(s.validate_windows_attributes(
      {'win': { 'sizepx': [10,10], 'viewports': ['foo'] }},
      {'foo': {}})).to.be.true;
  });

 it('validate_space_attributes catches malformed space definitions', () => { 
    expect(s.validate_space_attributes([], [])).to.be.false;
    expect(s.validate_space_attributes(null, undefined)).to.be.false;
    expect(s.validate_space_attributes(undefined, {})).to.be.false;
    expect(s.validate_space_attributes(undefined, 'foo')).to.be.false;
    expect(s.validate_space_attributes('bar')).to.be.false;
    expect(s.validate_space_attributes({}, [])).to.be.false;
    expect(s.validate_space_attributes({'machines': []})).to.be.false;
    expect(s.validate_space_attributes({'machines': []}, {})).to.be.false;
    expect(s.validate_space_attributes({'machines': false}, {})).to.be.false;
    expect(s.validate_space_attributes({'machines': null}, {})).to.be.false;
    expect(s.validate_space_attributes({'foo': 5}, {})).to.be.false;
    expect(s.validate_space_attributes({'machines': ['foo']}, {})).to.be.false;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo'}]}, {})).to.be.false;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: false}]}, {})).to.be.false;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: []}]}, {})).to.be.false;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: false}, 
                    {name: 'bar', windows: false}]}, {})).to.be.false;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: ['foowindow']}, 
                    {name: 'bar', windows: false}]}, {})).to.be.false;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: ['foowindow']}, 
                    {name: 'bar', windows: []}]}, 
      {foowindow: {}})).to.be.false;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: ['foowindow']}]}, 
      {foowindow: {}})).to.be.true;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: ['foowindow']}, 
                    {name: 'bar', windows: ['barwindow']}]}, 
      {foowindow: {}, barwindow: {}})).to.be.tru;
  });

  it('checks good and bad test-data', () => { 
    expect(s.validate_space_defn(data.ok_data)).to.be.true;
    expect(s.validate_space_defn(data.noviewports)).to.be.false;
  });
});
