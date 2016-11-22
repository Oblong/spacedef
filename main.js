let vec = require('javlin-pure');
var i = require('immutable');

function validate_windows_section(y) {
    if (!y || !y.viewports || !y.windows)
        return false;

    let windows_ok = true;
    let vs = i.Map(y.viewports);
    let ws = i.Map(y.windows);

    // Vet every window entry
    ws.forEach((w, key) => {
        // Each window must specify viewports list      
        if (!w.viewports || w.viewports.length == 0) {
            console.log('window definition [', key,
                '] lacks viewport list.');
            windows_ok = false;
        }

        vps = i.List(w.viewports);

        // Each item in viewports list must appear in top-level viewports collection.
        // Select for viewport names which DON'T appear previously.
        let missings = vps.valueSeq().filter(vname => !vs.has(vname)).toJS();
        if (missings.length > 0) {
            console.log('window definition [', key,
                '] refers to viewport(s) which are missing from the viewports collection: ',
                missings);
            windows_ok = false;
        }
    });
    return windows_ok;
}

function validate_space_section(y) {
    if (!y || !y.viewports || !y.windows)
        return false;

    // Missing space section completely is OK
    if (!y.space || !y.space.machines)
        return true;

    let space_ok = true;

    let vs = i.Map(y.viewports);
    let ws = i.Map(y.windows);
    let ms = i.List(y.space.machines);

    // Vet every machine entry
    ms.forEach(m => {
        let wins = i.List(m.windows);

        // Each item in windows list must appear in top-level windows collection.
        // Select for window names which DON'T appear previously.
        let missings = wins.valueSeq().filter(wname => !ws.has(wname)).toJS();
        if (missings.length > 0) {
            console.log('Machine definition [', m.name,
                '] refers to window(s) which are missing from the windows collection: ',
                missings);
            space_ok = false;
        }
    });
    return space_ok;
}

function validate_space_yaml(y) {
    if (!y || !y.viewports || !y.windows)
        return false;
    console.log('Validating space.yaml');
    let w = validate_windows_section(y);
    let s = validate_space_section(y);
    return w && s;
}

// Given a JSON representation of a space.yaml file, 
// returns a map of viewport definitions conforming to
// space.yaml 'viewports' definition.
// If there are "defaults" present, they'll be copied into all entries 
// in the collection (overriden by more-local attributes).
// Global defaults instantiated the same way.
// If there is no 'viewports' entry at all, a 'defaultviewport'
// will be returned.
function viewports_from_space_yaml(y) {
    if (!y || !y.viewports)
        return {
            defaultviewport: default_viewport()
        };

    let input = i.Map(y.viewports);

    // instantiate defaults in each entry; local attributes override defaults
    let specifed_defaults = i.Map(input.get('defaults'));
    input = input.map(v => specifed_defaults.merge(v));

    // instantiate platform defaults in each entry; local overrides global
    let global_defaults = i.Map(default_viewport());
    return input.map(v => global_defaults.merge(v)).toJS();
}

// Given a JSON representation of a space.yaml file, 
// returns a map of window definitions conforming to
// space.yaml 'windows' definition.
// If there are "defaults" present, they'll be copied into all entries 
// in the collection (overriden by more-local attributes).
// Global defaults instantiated the same way.
// If there is no 'windows' entry at all, one default 'main' window 
// will be returned.
function windows_from_space_yaml(y) {
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
        console.log("Not a valid screen protein:", screen);
        return null;
    } else if (!feld || !is_feld_protein(feld)) {
        console.log("Not a valid feld protein:", feld);
        return null;
    } else if (!room || !is_room_protein(room)) {
        console.log("Not a valid room protein:", room);
        return null;
    }

    console.log("Processing screen protein.");
    let viewports = viewports_from_screen_protein(screen);

    console.log("Processing room protein.");
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
        console.log("Processing kombi feld protein.");

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
        console.log("Processing (regular) feld protein.");
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
    if (p && p.ingests && p.ingests.felds) {
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
    return (p && p.ingests && p.ingests.screens &&
        Object.keys(p.ingests.screens).length > 0);
}

// Returns true if JSON representation matches valid feld protein
function is_feld_protein(p) {
    return (p && p.ingests && p.ingests.felds &&
        Object.keys(p.ingests.felds).length > 0);
}

// Returns true if JSON representation matches valid screen protein
function is_room_protein(p) {
    return (p && p.ingests &&
        p.ingests['this-machine'] &&
        p.ingests['principal'] &&
        Object.keys(p.ingests['machines-in-room']).length > 0);
}

// Converts a screen description to a space.yaml 'viewport' description.
// Assumes a 'name' attribute.
function viewport_attributes_from_screen(attributes) {
    let o = default_viewport();

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
        wands: r.get('wands-pool'),
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

    return global_defaults.merge(room_settings).toJS();
}

// Defaults as defined in space.yaml
function default_viewport() {
    return {
        cent: [0, 0, -2000],
        norm: [0, 0, 1],
        up: [0, 1, 0],
        sizepx: [1920, 1080],
        sizemm: [1920, 1080],
        eye: [0, 0, 0],
        cameratype: 'perspective',
        offsetpx: [0, 0]
    };
}

// Defaults as defined in space.yaml
function default_window() {
    return {
        sizepx: [1920, 1080],
        offsetpx: [0, 0],
        transparent: false,
        titlebar: false,
        viewports: ['defaultviewport']
    };
}

// Defaults as defined in space.yaml
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

// Functions for working with space.yaml file
exports.validate_space_yaml = validate_space_yaml;
exports.viewports_from_space_yaml = viewports_from_space_yaml;
exports.windows_from_space_yaml = windows_from_space_yaml;

// Functions for working with feld/screen proteins
exports.convert_roomfeldscreen_to_space = convert_roomfeldscreen_to_space;
exports.viewports_from_screen_protein = viewports_from_screen_protein;
exports.windows_from_feld_protein = windows_from_feld_protein;
exports.viewports_from_kombi = viewports_from_kombi;
exports.is_screen_protein = is_screen_protein;
exports.is_feld_protein = is_feld_protein;
exports.is_kombifeld_protein = is_kombifeld_protein;
exports.fold_kombi_info_into = fold_kombi_info_into;
exports.window_names_from_feld_protein = window_names_from_feld_protein;

// room.protein functions
exports.space_from_room_protein = space_from_room_protein

// Global defaults
exports.default_viewport = default_viewport;
exports.default_window = default_window;
exports.default_space = default_space;