// (c) oblong industries

const vec = require('javlin-pure');
const i = require('immutable');
const _ = require('lodash');
const harmonize = require('./vectortrio.js').harmonize;

// Returns false if:
//  - arg null, undefined, not a map, or an empty map
//  - 'defaults' key is present but nothing else
function validate_viewports_attributes(viewports) {
    if (!_.isObject(viewports)) {
        console.error('Viewports attributes map is not a map.');
        return false;
    }

    let viewports_map = i.Map(viewports);

    if (viewports_map.size == 0) {
        console.error('No viewports defined.');
        return false;
    }

    if (viewports_map.has('defaults') && viewports_map.size == 1) {
        console.error('No viewports defined, just some default attributes.');
        return false;
    }
    return true;
}

// Returns false if:
//  - args are null, undefined, not a map, or an empty map
//  - 'defaults' key is present but nothing else
//  - any item in windows object lacks 'viewports' list or string
//  - That list or string mentions a viewport which isn't included
//    in in the viewports collection
function validate_windows_attributes(windows, viewports) {
    if (!_.isObject(windows)) {
        console.error('Windows attributes map is not a map.');
        return false;
    }
    if (!_.isObject(viewports)) {
        console.error('Viewports attributes map is not a map.');
        return false;
    }

    let viewports_map = i.Map(viewports);
    let windows_map = i.Map(windows);

    if (windows_map.size == 0) {
        console.error('No windows defined.');
        return false;
    }

    if (windows_map.has('defaults') && windows_map.size == 1) {
        console.error('No windows defined, just some default attributes.');
        return false;
    }

    if (viewports_map.size == 0) {
        console.error('No viewports defined.');
        return false;
    }

    let windows_ok = true;

    // Vet every window entry individually -- continue through all
    // in case of failure
    windows_map.forEach((w, key) => {

        // must have viewports attribute
        if (_.isNil(w.viewports)) {
            console.error('Window definition [', key,
                '] lacks viewports attribute.');
            windows_ok = false;
            return;
        }

        // Each window must specify viewports list (or a string)
        if (_.isString(w.viewports)) {

            if (!viewports_map.has(w.viewports)) {
                console.error('Window definition [', key,
                    '] refers to a viewport which is missing from the viewports collection: ',
                    w.viewports);
                windows_ok = false;
            }

        } else if (_.isArray(w.viewports)) {
            if (w.viewports.length == 0) {
                console.error('Window definition [', key,
                    '] viewports array length is 0.');
                windows_ok = false;
                return;
            }

            viewport_names = i.List(w.viewports);

            // Select for viewport names which DON'T appear previously.
            let missings = viewport_names.valueSeq().filter(nom => !
                viewports_map.has(nom)).toJS();

            // Each item in viewports list must appear in prior viewports collection.
            if (missings.length > 0) {
                console.error('Window definition [', key,
                    '] refers to viewport(s) which are missing from the viewports collection: ',
                    missings);
                windows_ok = false;
            }

        } else {
            console.error('Window definition [', key,
                '] viewports attribute is not array or string.');
            windows_ok = false;
        }

    });
    return windows_ok;
}


// Returns false if:
//  - args are null, undefined, not a map, or an empty map
//  - machines list not a list, or empty
//  - machines list has more than one principal=true
// TODO: assume that windows is already valid?  Validate it here?
function validate_space_attributes(space, windows) {
    if (!_.isObject(space)) {
        console.error('Space attributes map is not a map.');
        return false;
    }
    if (!_.isObject(windows)) {
        console.error('Windows attributes map is not a map.');
        return false;
    }

    let space_map = i.Map(space);
    let windows_map = i.Map(windows);

    if (space_map.size == 0) {
        console.error('Space attributes map empty.');
        return false;
    }

    if (!_.isArray(space.machines)) {
        console.error('Machines list is not a list.');
        return false;
    }

    let ms = i.List(space.machines);
    if (ms.size == 0) {
        console.error('Machines list is empty.');
        return false;
    }
    if (!_.isObject(ms.get(0))) {
        console.error('Machines list item is not an object.');
        return false;
    }

    let space_ok = true;
    let principal_count = 0;
    let ws = i.Map(windows);

    // Vet every window entry
    ms.forEach((m, key) => {
        if (!m.name) {
            console.error("Machine definition lacks 'name' attribute.");
            space_ok = false;
            return;
        }
        if (!m.windows || !_.isArray(m.windows) || m.windows.length == 0) {
            console.error("Machine definition '", m.name,
                "' lacks 'windows' list.");
            space_ok = false;
            return;
        }

        if (m.principal)
            principal_count += 1;

        // Select for window names which DON'T appear previously.
        let wins = i.List(m.windows);
        let missings = wins.valueSeq().filter(nom => !windows_map.has(
            nom)).toJS();

        // Each item in a machine's windows list must appear in 
        // windows collection.
        if (missings.length > 0) {
            console.error('Machine definition [', m.name,
                '] refers to window(s) which are missing from the windows collection: ',
                missings);
            space_ok = false;
        }

    });

    if (principal_count > 1) {
        console.error('More than one machine marked as principal');
        return false;
    }
    return space_ok;
}


// Returns false if:
//  - argumentis null, undefined, not a map, or an empty map
//  - windows is present but viewports not present
//  - space is present, but viewports or windows not present
//  - any section doesn't validate using functions defined above
function validate_space_defn(o) {
    if (!_.isObject(o)) {
        console.error('Space definition map is not a map.');
        return false;
    }

    let defn = i.Map(o);
    if (defn.size == 0) {
        console.error('Space definition empty.');
        return false;
    }

    if (defn.has('windows')) {
        if (!defn.has('viewports')) {
            console.error('"windows" section requires a separate viewports collection.');
            return false;
        }

        if (!validate_viewports_attributes(o.viewports))
            return false;

        if (!validate_windows_attributes(o.windows, o.viewports))
            return false;
    }

    if (defn.has('space')) {
        if (!defn.has('windows')) {
            console.error('"space" section requires a windows section.');
            return false;
        }

        if (!validate_space_attributes(o.space, o.windows))
            return false;
    }

    return true;
}

// Given a space definition returns a valid map of viewport definitions 
// with all defaults installed but overriden by any local attributes.
// Global defaults instantiated the same way.
// norm / over / up vectors are harmonized and any missing filled in.
// If there is no 'viewports' entry at all, returns a map with one 
// 'defaultviewport' in it.
// Any "defaults" section is not returned.
function viewports_from_space_defn(y) {
    if (!y || !y.viewports || !_.isObject(y.viewports) || !validate_viewports_attributes(
            y.viewports))
        return {
            defaultviewport: default_viewport()
        };

    let input = i.Map(y.viewports);
    let global_defaults = i.Map(default_viewport());

    // instantiate defaults in each entry; local attributes override defaults
    let specifed_defaults = i.Map(input.get('defaults'));
    let user_settings = input.map(v => {
        let with_defaults = specifed_defaults.merge(v);
        let w = with_defaults.toJS();
        let normoverup = harmonize(w.norm, w.over, w.up);
        return with_defaults.merge(i.Map(normoverup));
    });

    // flesh out each entry with platform defaults
    let final_settings = user_settings.map(v => global_defaults.merge(v));
    final_settings = final_settings.delete('defaults');

    return final_settings.toJS();
}

// Given a JSON representation of a space.yaml file, 
// returns a map of window definitions conforming to
// space.yaml 'windows' definition.
// If there are "defaults" present, they'll be copied into all entries 
// in the collection (overriden by more-local attributes).
// Global defaults instantiated the same way.
// If there is no 'windows' entry at all, one default 'main' window 
// will be returned.
function windows_from_space_defn(y) {
    if (!y || !y.windows)
        return {
            main: default_window()
        };

    let input = i.Map(y.windows);

    // instantiate defaults in each entry; local attributes override defaults
    let specifed_defaults = i.Map(input.get('defaults'));
    input = input.map(v => specifed_defaults.merge(v));

    // instantiate platform defaults in each entry; local overrides global
    let global_defaults = i.Map(default_window());
    return input.map(v => global_defaults.merge(v)).toJS();
}

// Given JSON representations of room, feld, and screen proteins,
// return a JS object representing a valid space.yaml definition,
// or null on error
function convert_roomfeldscreen_to_space(room, feld, screen) {
    if (!screen || !is_screen_protein(screen)) {
        console.error("Not a valid screen protein:", screen);
        return null;
    } else if (!feld || !is_feld_protein(feld)) {
        console.error("Not a valid feld protein:", feld);
        return null;
    } else if (!room || !is_room_protein(room)) {
        console.error("Not a valid room protein:", room);
        return null;
    }

    let viewports = viewports_from_screen_protein(screen);

    let space = space_from_room_protein(room);
    let this_machine_name = room.ingests['this-machine'];
    let this_machine_index = 0;
    for (let i = 0; i < space.machines.length; i++) {
        let m = space.machines[i];
        if (m.name == this_machine_name) {
            this_machine_index = i;
            break;
        }
    }

    let windows;

    if (is_kombifeld_protein(feld)) {

        // Gather viewport pixel size and offset info from kombi protein
        // fold into viewport list
        let kombi_viewports = viewports_from_kombi(feld);
        viewports = fold_kombi_info_into(kombi_viewports, viewports);

        // The extra viewports requested by kombifeld must 
        // be assigned to a window (named 'all').
        windows = windows_from_feld_protein(feld);
        windows.all.viewports = Object.keys(kombi_viewports);

        // In feld/screen setups, we only define one machine, machine 0.
        // In kombi, there is conventionally one window named 'all'
        space.machines[this_machine_index].windows = ['all'];

    } else if (is_feld_protein(feld)) {
        windows = windows_from_feld_protein(feld);

        // In feld/screen setups, we only define one machine, machine 0.
        // It gets all the windows named in the feld protein.
        space.machines[this_machine_index].windows =
            window_names_from_feld_protein(
                feld);
    }

    return {
        viewports: viewports,
        windows: windows,
        space: space
    };
}

// Given a JSON representation of a screen protein, 
// returns a map of viewport definitions conforming to
// space.yaml 'viewports' definition
function viewports_from_screen_protein(p) {
    let vs = {};
    if (p && p.ingests && p.ingests.screens) {
        for (let nom in p.ingests.screens) {
            let o = p.ingests.screens[nom];
            vs[nom] = viewport_attributes_from_screen(o);
        }
    }
    return vs;
}

// Given a JSON representation of a feld protein, 
// returns a map of window definitions conforming to
// space.yaml 'window' definition.
// Works for both regular and kombi.
function windows_from_feld_protein(p) {
    let ws = {};
    if (is_feld_protein(p)) {
        for (let nom in p.ingests.felds) {
            let o = p.ingests.felds[nom];
            ws[nom] = window_attributes_from_feld(o);
        }
    }
    return ws;
}

// Returns a list of all window names
//  NOTE: assumes kombifelds only EVER have one window, named main.
// Seems true in practice.
function window_names_from_feld_protein(p) {
    let noms = [];
    if (is_kombifeld_protein(p)) {
        return ['main'];
    } else if (is_feld_protein(p)) {
        for (let nom in p.ingests.felds) {
            noms.push(nom);
        }
    }
    return noms;
}

// Given a JSON representation of a kombifeld protein, 
// returns a JS object (a map) of PARTIAL viewport info -- it's just
// the info that is novel in the kombifeld file, 
// found under the "ingests/felds/all/felds" section.
// Keys are the keys of that section.
// Values are partial viewport descriptions.
// We expect the rest of the info about this viewport is in the 
// screen.protein
function viewports_from_kombi(p) {
    let vs = {};

    if (!is_kombifeld_protein(p))
        return vs;

    //  In kombi proteins, there is a nested map of viewports.
    //  (Confusingly, it has the key "felds"...
    //  But it is not really about felds (OS windows), it's viewports
    //  grouped WITHIN a window.)
    let kombi_views_map = p.ingests.felds.all.felds;
    for (let nom in kombi_views_map) {
        let o = kombi_views_map[nom];
        vs[nom] = {
            sizepx: [o.window[2], o.window[3]],
            offsetpx: [o.window[0], o.window[1]]
        };
    }
    return vs;
}

// Given a JSON representation of a kombifeld protein, 
// returns true if it has the "all" + "kombi" signature 
// indicating true wild kombifeld
function is_kombifeld_protein(p) {
    if (_.isObject(p) && _.has(p, ['ingests', 'felds'])) {
        for (let nom in p.ingests.felds) {
            if (nom == "all" && p.ingests.felds.all.type == "kombi") {
                return true;
            }
        }
    }
    return false;
}

// Returns true if JSON representation matches valid screen protein
function is_screen_protein(p) {
    console.log('check ', p);
    return (_.isObject(p) && _.has(p, ['ingests', 'screens']) &&
        Object.keys(p.ingests.screens).length > 0);
}

// Returns true if JSON representation matches valid feld protein
function is_feld_protein(p) {
    return (_.isObject(p) && _.has(p, ['ingests', 'felds']) &&
        Object.keys(p.ingests.felds).length > 0);
}

// Returns true if JSON representation matches valid screen protein
function is_room_protein(p) {
    return (_.isObject(p) && _.has(p, ['ingests', 'this-machine']) &&
        _.has(p, ['ingests', 'principal']) &&
        Object.keys(p.ingests['machines-in-room']).length > 0);
}

// Converts a screen description to a space.yaml 'viewport' description.
// Assumes a 'name' attribute.
function viewport_attributes_from_screen(attributes) {
    let o = default_viewport();
    if (!_.isObject(attributes)) {
        return o;
    }

    if (attributes.cent)
        o.cent = attributes.cent;

    //  TODO: defaulting logic for norm/over/up
    if (attributes.norm)
        o.norm = attributes.norm;
    if (attributes.up)
        o.up = attributes.up;
    if (attributes.over)
        o.over = attributes.over;

    if (attributes['px-size'])
        o.sizepx = attributes['px-size'];
    if (attributes['phys-size'])
        o.sizemm = attributes['phys-size'];
    if (attributes['eye-dist']) {
        let to_cam = vec.scale(o.norm, attributes['eye-dist']);
        o.eye = vec.add(o.cent, to_cam);
    }
    return o;
}

// Given two maps, for any key/object pairs which exist in both,
// kombi attributes 'sizepx' and 'offsetpx' will be
// imported from the first into the second.  Returns a new list.
function fold_kombi_info_into(kombi_map, vs) {
    let new_vs = vs;
    for (let nom in kombi_map) {
        if (vs[nom]) {
            vs[nom].sizepx = kombi_map[nom].sizepx;
            vs[nom].offsetpx = kombi_map[nom].offsetpx;
        }
    }
    return new_vs;
}

// Expects:
//    { name: foo,
//      window: [0, 0, 1920, 1080],
//      screen: main
//     }
// Assumes a 'name' attribute.
// Resulting object conforms to a window definition from space.yaml 
function window_attributes_from_feld(attributes) {
    return {
        offsetpx: [attributes.window[0], attributes.window[1]],
        sizepx: [attributes.window[2], attributes.window[3]],
        transparent: false,
        titlebar: false,
        viewports: [attributes.screen]
    };
}

//  room.protein has no info about windows, so the windows lists for 
//  each machine will be EMPTY.
function space_from_room_protein(p) {
    if (!is_room_protein)
        return default_space();

    let global_defaults = i.Map(default_space());
    let r = i.Map(p.ingests);
    let room_settings = i.Map({
        multimachine: r.get('room-enabled'),
        timeout: r.get('sync-timeout'),
        machines: r.get('machines-in-room').map(m => {
            let machine_info = {
                name: m,
                windows: []
            };
            if (m == r.get('principal'))
                machine_info.principal = true;
            return machine_info;
        })
    });

    if (r.get('wands-pool')) {
        room_settings = room_settings.set('wands', r.get('wands-pool'));
    }

    return global_defaults.merge(room_settings).toJS();
}

// Defaults according to space definition spec
function default_viewport() {
    return {
        cent: [0, 0, -2000],
        norm: [0, 0, 1],
        over: [1, 0, 0],
        up: [0, 1, 0],
        sizepx: [1920, 1080],
        sizemm: [1920, 1080],
        eye: [0, 0, 0],
        offsetpx: [0, 0]
    };
}

// Defaults according to space definition spec
function default_window() {
    return {
        sizepx: [1920, 1080],
        offsetpx: [0, 0],
        viewports: ['defaultviewport']
    };
}

// Defaults according to space definition spec
function default_space() {
    return {
        multimachine: false,
        timeout: 300,
        syncserver: 'localhost',
        machines: [{
            name: 'localhost',
            principal: true,
            windows: ['defaultwindow']
        }]
    };
}

function default_room() {
    return {
        descrips: 'room-configuration',
        ingests: {
            principal: 'localhost',
            'room-enabled': false,
            'this-machine': 'localhost',
            'sync-timeout': 300,
            'machines-in-room': ['localhost']
        }
    };
}

// Functions for working with space definitions
exports.validate_viewports_attributes = validate_viewports_attributes;
exports.validate_windows_attributes = validate_windows_attributes;
exports.validate_space_attributes = validate_space_attributes;
exports.validate_space_defn = validate_space_defn;
exports.viewports_from_space_defn = viewports_from_space_defn;
exports.windows_from_space_defn = windows_from_space_defn;

// Conversion
exports.convert_roomfeldscreen_to_space = convert_roomfeldscreen_to_space;

// Functions for working with feld/screen proteins
exports.viewports_from_screen_protein = viewports_from_screen_protein;
exports.windows_from_feld_protein = windows_from_feld_protein;
exports.window_names_from_feld_protein = window_names_from_feld_protein;
exports.viewports_from_kombi = viewports_from_kombi;
exports.is_kombifeld_protein = is_kombifeld_protein;
exports.is_screen_protein = is_screen_protein;
exports.is_feld_protein = is_feld_protein;
exports.is_room_protein = is_room_protein;
exports.fold_kombi_info_into = fold_kombi_info_into;

// room.protein functions
exports.space_from_room_protein = space_from_room_protein

// Global defaults
exports.default_viewport = default_viewport;
exports.default_window = default_window;
exports.default_space = default_space;
exports.default_room = default_room;