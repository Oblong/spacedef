# spacedef

Functions for working with feld/screen/room proteins and spacefiles (`space.yaml`).  Serves as an implementation of the space definition draft (v. 0.7)

This is a pure Javascript lib (users must do their own e.g. file IO)


### Functions for working with space definitions
- `validate_viewports_attributes()`
- `validate_windows_attributes()`
- `validate_space_attributes()`
- `validate_space_defn()`
- `viewports_from_space_defn()`
- `windows_from_space_defn()`

### Conversion
- `convert_roomfeldscreen_to_space()`  <<== **Spits out a legal space def**

### Functions for working with feld/screen proteins
- `viewports_from_screen_protein()`
- `windows_from_feld_protein()`
- `viewports_from_kombi()`
- `is_screen_protein()`
- `is_feld_protein()`
- `is_kombifeld_protein()`
- `fold_kombi_info_into()`
- `window_names_from_feld_protein()`

### room.protein functions
- `space_from_room_protein()`

### Global defaults
- `default_viewport()`
- `default_window()`
- `default_space()`
