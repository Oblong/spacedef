# spacedef

Functions for working with feld/screen/room proteins and spacefiles (`space.yaml`).  Serves as an implementation of the space definition draft (v. 0.7)

This is a pure Javascript lib (users must do their own e.g. file IO)


### Functions for working with space definitions
- `validate_viewports_attributes()`

        // Returns false if:
        //  - arg null, undefined, not a map, or an empty map
        //  - 'defaults' key is present but nothing else

- `validate_windows_attributes()`

        // Returns false if:
        //  - args are null, undefined, not a map, or an empty map
        //  - 'defaults' key is present but nothing else
        //  - any item in windows object lacks 'viewports' list or string
        //  - That list or string mentions a viewport which isn't included
        //    in in the viewports collection

- `validate_space_attributes()`

        // Returns false if:
        //  - args are null, undefined, not a map, or an empty map
        //  - machines list not a list, or empty
        //  - machines list has more than one principal=true
        
- `validate_space_defn()`

        // Returns false if:
        //  - argumentis null, undefined, not a map, or an empty map
        //  - windows is present but viewports not present
        //  - space is present, but viewports or windows not present
        //  - any section doesn't validate using functions defined above

- `viewports_from_space_defn()`

        // Given a space definition returns a valid map of viewport definitions 
        // with all defaults installed but overriden by any local attributes.
        // Global defaults instantiated the same way.
        // norm / over / up vectors are harmonized and any missing filled in.
        // If there is no 'viewports' entry at all, returns a map with one 
        // 'defaultviewport' in it.
        // Any "defaults" section is not returned.

- `windows_from_space_defn()`

        // Given a JSON representation of a space.yaml file, 
        // returns a map of window definitions conforming to
        // space.yaml 'windows' definition.
        // If there are "defaults" present, they'll be copied into all entries 
        // in the collection (overriden by more-local attributes).
        // Global defaults instantiated the same way.
        // If there is no 'windows' entry at all, one default 'main' window 
        // will be returned.


### Conversion
- `convert_roomfeldscreen_to_space()`  <<== **Spits out a legal space def**

        // Given JSON representations of room, feld, and screen proteins,
        // return a JS object representing a valid space.yaml definition,
        // or null on error


### Functions for working with feld/screen proteins
- `viewports_from_screen_protein()`

        // Given a JSON representation of a screen protein, 
        // returns a map of viewport definitions conforming to
        // space.yaml 'viewports' definition

- `windows_from_feld_protein()`

        // Given a JSON representation of a feld protein, 
        // returns a map of window definitions conforming to
        // space.yaml 'window' definition.
        // Works for both regular and kombi.

- `viewports_from_kombi()`

        // Given a JSON representation of a kombifeld protein, 
        // returns a JS object (a map) of PARTIAL viewport info -- it's just
        // the info that is novel in the kombifeld file, 
        // found under the "ingests/felds/all/felds" section.
        // Keys are the keys of that section.
        // Values are partial viewport descriptions.
        // We expect the rest of the info about this viewport is in the 
        // screen.protein

- `is_screen_protein()`

        // Returns true if JSON representation matches valid screen protein

- `is_feld_protein()`

        // Returns true if JSON representation matches valid feld protein

- `is_kombifeld_protein()`

        // Given a JSON representation of a kombifeld protein, 
        // returns true if it has the "all" + "kombi" signature 
        // indicating true wild kombifelds

- `fold_kombi_info_into()`

        // Given two maps, for any key/object pairs which exist in both,
        // kombi attributes 'sizepx' and 'offsetpx' will be
        // imported from the first into the second.  Returns a new list.

- `window_names_from_feld_protein()`

        // Returns a list of all window names
        //  NOTE: assumes kombifelds only EVER have one window, named main.
        // Seems true in practice.

### room.protein functions
- `space_from_room_protein()`

        //  room.protein has no info about windows, so the windows lists for 
        //  each machine will be EMPTY.

### Global defaults
- `default_viewport()`
- `default_window()`
- `default_space()`
- `default_room()`


