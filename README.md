# spacedef

Functions for working with feld/screen/room proteins and spacefiles (`space.yaml`).  Serves as an implementation of the space definition draft (v. 0.7)



### room.protein functions
- `space_from_room_protein()`

### Functions for working with space.yaml file
- `validate_space_yaml()`
- `viewports_from_space_yaml()`
- `windows_from_space_yaml()`

### Functions for working with feld/screen proteins
- `convert_roomfeldscreen_to_space()`
- `viewports_from_screen_protein()`
- `windows_from_feld_protein()`
- `viewports_from_kombi()`
- `is_screen_protein()`
- `is_feld_protein()`
- `is_kombifeld_protein()`
- `fold_kombi_info_into()`
- `window_names_from_feld_protein()`

### Global defaults
- `default_viewport()`
- `default_window()`
- `default_space()`
