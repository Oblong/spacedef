const i = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect    = chai.expect;
var assert    = chai.assert;
var s = require('../main.js');
var harmonize = require('../vectortrio.js').harmonize;
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
      {foowindow: {}, barwindow: {}})).to.be.true;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: ['foowindow'], principal: true}, 
                    {name: 'bar', windows: ['barwindow']}]}, 
      {foowindow: {}, barwindow: {}})).to.be.true;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: ['foowindow'], principal: true}, 
                    {name: 'bar', windows: ['barwindow'], principal: false}]}, 
      {foowindow: {}, barwindow: {}})).to.be.true;
    expect(s.validate_space_attributes(
      {'machines': [{name: 'foo', windows: ['foowindow'], principal: true}, 
                    {name: 'bar', windows: ['barwindow'], principal: true}]}, 
      {foowindow: {}, barwindow: {}})).to.be.false;
  });

  it('checks good and bad test-data', () => { 
    expect(s.validate_space_defn(data.ok_data)).to.be.true;
    expect(s.validate_space_defn(data.noviewports)).to.be.false;
  });

  let canon = {
    norm: [0,0,1],
    over: [1,0,0],
    up: [0,1,0]
  };

  it('harmonize works for no input data', () => { 
      assert.deepEqual(canon, harmonize());
      assert.deepEqual(canon, harmonize(null));
      assert.deepEqual(canon, harmonize(null, null));
      assert.deepEqual(canon, harmonize(null, null, null));
      assert.deepEqual(canon, harmonize(undefined));
      assert.deepEqual(canon, harmonize(undefined, undefined));
      assert.deepEqual(canon, harmonize(undefined, undefined, undefined));
      assert.deepEqual(canon, harmonize(null, undefined, null));
      assert.deepEqual(canon, harmonize(null, undefined));
      assert.deepEqual(canon, harmonize(undefined, undefined, null));
      assert.deepEqual(canon, harmonize({}, undefined, []));
      assert.deepEqual(canon, harmonize([1,2], [], {}));
      assert.deepEqual(canon, harmonize([0], undefined, []));
      assert.deepEqual(canon, harmonize([0], [0,0,0,0], []));
      assert.deepEqual(canon, harmonize([0], [0,0,0,0]));
      assert.deepEqual(canon, harmonize({}, undefined, []));
      assert.deepEqual(canon, harmonize([], false));
  });

  it('harmonize handles norm/over/up input cases correctly', () => { 
    //  { norm, over, up }   => over will be modified to match norm/up
    assert.deepEqual(canon, 
                     harmonize([0,0,1], [999,999,999], [0,1,0]));
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([-1,0,0], [999,999,999], [0,1,0]));

    //  { _,    over, up }   => derives norm
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([], [0,0,1], [0,1,0]));
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize(null, [0,0,1], [0,1,0]));

    //  { norm, _,    up }   => derives over
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([-1,0,0], [], [0,1,0]));
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([-1,0,0], undefined, [0,1,0]));

    //  { norm, over, _  }   => derives up
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([-1,0,0], [0,0,1], []));
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([-1,0,0], [0,0,1], {}));

    //  { _,    _,    up }   => get default norm [0 0 1], derive over
    assert.deepEqual({norm: [0,0,1], over: [1,0,0], up: [0,1,0]}, 
                     harmonize(null, [], [0,1,0]));
    assert.deepEqual({norm: [0,0,1], over: [1,0,0], up: [0,1,0]}, 
                     harmonize(undefined, {}, [0,1,0]));
    assert.deepEqual({norm: [0,0,1], over: [1,0,0], up: [0,1,0]}, 
                     harmonize(undefined, {}, [0,1,0]));

    //  { norm, _,     _ }   => get default up [0 1 0], derive over 
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([-1,0,0], null, []));
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize([-1,0,0], undefined, {}));
    assert.deepEqual({norm: [0,0,1], over: [1,0,0], up: [0,1,0]}, 
                     harmonize([0,0,1], undefined, {}));

    //  { _,    over,  _ }   => get default up [0 1 0] derive norm
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize(null, [0,0,1], []));
    assert.deepEqual({norm: [-1,0,0], over: [0,0,1], up: [0,1,0]}, 
                     harmonize(undefined, [0,0,1], {}));
    assert.deepEqual({norm: [0,0,1], over: [1,0,0], up: [0,1,0]}, 
                     harmonize(undefined, [1,0,0], {}));
  });

  let default_vp = s.default_viewport();

  it('viewports_from_space_defn fleshes out norm/over/up data', () => { 
    assert.deepEqual(s.viewports_from_space_defn(),
                     {defaultviewport: default_vp});
    assert.deepEqual(s.viewports_from_space_defn(null),
                     {defaultviewport: default_vp});
    assert.deepEqual(s.viewports_from_space_defn([]),
                     {defaultviewport: default_vp});
    assert.deepEqual(s.viewports_from_space_defn({}),
                     {defaultviewport: default_vp});
    assert.deepEqual(s.viewports_from_space_defn({'key': {}}),
                     {defaultviewport: default_vp});
    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'defaults': false}}),
      {defaultviewport: default_vp});
    assert.deepEqual(s.viewports_from_space_defn({'foo': false}),
      {defaultviewport: default_vp});
    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {}}}),
      {foo: default_vp});
    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {}, 'bar': {} }}),
      {foo: default_vp, bar: default_vp});
    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {}, 'defaults': {}}}),
      {foo: default_vp});

    let fooish_vp = Object.assign({}, default_vp);
    fooish_vp.attrib = 'fooish';
    let barish_vp = Object.assign({}, default_vp);
    barish_vp.attrib = 'barish';

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {'attrib': 'fooish'}, 'bar': {} }}),
      {foo: fooish_vp, bar: default_vp});

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {'attrib': 'fooish'}, 'bar': {}, 'defaults': {'attrib': 'barish'} }}),
      {foo: fooish_vp, bar: barish_vp});

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {}, 'bar': {}, 'defaults': {'attrib': 'fooish'} }}),
      {foo: fooish_vp, bar: fooish_vp});

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {}, 'bar': {'attrib': 'barish'}, 'defaults': {'attrib': 'fooish'} }}),
      {foo: fooish_vp, bar: barish_vp});

    let upsidedown_vp = Object.assign({}, default_vp);
    upsidedown_vp.up = [0,-1,0];
    upsidedown_vp.over = [-1,0,0];

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {'up': [0,-1,0], 'over': [-1,0,0]}, 'bar': {} }}),
      {foo: upsidedown_vp, bar: default_vp});

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {'up': [0,-1,0]}, 'bar': {} }}),
      {foo: upsidedown_vp, bar: default_vp});

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {'up': [0,-1,0]}, 'bar': {}, 'defaults': {'up': [0,1,0]} }}),
      {foo: upsidedown_vp, bar: default_vp});

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {}, 'bar': {}, 'defaults': {'up': [0,-1,0]} }}),
      {foo: upsidedown_vp, bar: upsidedown_vp});

    assert.deepEqual(s.viewports_from_space_defn(
      {'viewports': {'foo': {}, 'bar': {'up': [0,1,0]}, 'defaults': {'up': [0,-1,0]} }}),
      {foo: upsidedown_vp, bar: default_vp});

  });

});
