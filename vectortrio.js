// (c) oblong industries

const _ = require('lodash');
const vec = require('javlin-pure');

function cross3(v1, v2) {
    return [
        (v1[1] * v2[2]) - (v1[2] * v2[1]),
        (v1[2] * v2[0]) - (v1[0] * v2[2]),
        (v1[0] * v2[1]) - (v1[1] * v2[0])
    ]
}

function scrub_negative_zero(ns) {
    return ns.map(n => Object.is(n, -0) ? 0 : n);
}

// Derives over vector, handles these cases:
//  { norm, up }   => derives over
//  { _,    up }   => get default norm [0 0 1], derive over
//  { norm,  _ }   => get default up [0 1 0], derive over
//  { _,     _ }   => get norm [0 0 1] up [0 1 0], derive over
function from_norm_up(norm, up) {
    if (!_.isArray(up) || up.length != 3)
        up = [0, 1, 0];
    if (!_.isArray(norm) || norm.length != 3)
        norm = [0, 0, 1];
    return {
        norm: scrub_negative_zero(norm),
        over: scrub_negative_zero(cross3(up, norm)),
        up: scrub_negative_zero(up),
    };
}

// Derives norm vector, handles these cases:
//  { over, up }   => derives norm
//  { over,  _ }   => get default up [0 1 0] derive norm
//  { _,    up }   => get default over [1 0 0] derive norm
//  { _,     _ }   => get over [1 0 0] up [0 1 0] derive norm
function from_over_up(over, up) {
    if (!_.isArray(up) || up.length != 3)
        up = [0, 1, 0];
    if (!_.isArray(over) || over.length != 3)
        over = [1, 0, 0];
    return {
        norm: scrub_negative_zero(cross3(over, up)),
        over: scrub_negative_zero(over),
        up: scrub_negative_zero(up)
    };
}

// Args are arrays -- or may be null/undefined
// Input options:
//  { norm, over, up }   => over will be modified to match norm/up
//  { _,    over, up }   => derives norm
//  { norm, _,    up }   => derives over
//  { norm, over, _  }   => derives up
//  { _,    _,    up }   => get default norm [0 0 1], derive over
//  { norm, _,     _ }   => get default up [0 1 0], derive over (*common case*)
//  { _,    over,  _ }   => get default up [0 1 0] derive norm
//  { _,    _,     _ }   => get norm [0 0 1] up [0 1 0], derive over
//  Returns an object with all of { norm, over, up } defined.
function harmonize(norm, over, up) {
    //  handles cases where over is missing:
    //  { norm, _,    up }   => derives over
    //  { _,    _,    up }   => get default norm [0 0 1], derive over
    //  { norm, _,     _ }   => get default up [0 1 0], derive over
    //  { _,    _,     _ }   => get norm [0 0 1] up [0 1 0], derive over
    if (!_.isArray(over) || over.length != 3)
        return from_norm_up(norm, up);

    //  handles cases where norm is missing:
    //  { _,    over, up }   => derives norm
    //  { _,    over,  _ }   => get default up [0 1 0] derive norm
    if (!_.isArray(norm) || norm.length != 3)
        return from_over_up(over, up);

    // remaining case where only up is missing:
    //  { norm, over, _  }   => derives up
    if (!_.isArray(up) || up.length != 3)
        up = cross3(norm, over);

    // case where nothing is missing -- over must comply
    //  { norm, over, up }   => over will be modified to match norm/up
    else
        over = cross3(up, norm);

    return {
        norm: scrub_negative_zero(norm),
        over: scrub_negative_zero(over),
        up: scrub_negative_zero(up)
    };
}

function harmonize_and_normalize(norm, over, up) {
    let o = harmonize(norm, over, up);
    return {
        norm: vec.norm(o.norm),
        over: vec.norm(o.over),
        up: vec.norm(o.up)
    };
}

exports.harmonize = harmonize;
exports.harmonize_and_normalize = harmonize_and_normalize;