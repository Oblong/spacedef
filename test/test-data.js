exports.ok_data = {
    'viewports': {
        'a': {
            'cent': [0, 0, -160]
        },
        'b': {
            'cent': [160, 0, 160]
        },
        'c': {
            'cent': [80, -90, -160],
            'sizepx': [1280, 360],
            'sizemm': [320, 90]
        },
        'defaults': {
            'sizepx': [640, 360],
            'sizemm': [160, 90]
        }
    },

    'windows': {
        'awindow': {
            'sizepx': [640, 360],
            'viewports': ['a']
        },
        'bwindow': {
            'offsetpx': [640, 0],
            'sizepx': [640, 360],
            'viewports': ['b']
        },
        'cwindow': {
            'offsetpx': [0, 385],
            'sizepx': [1280, 360],
            'viewports': ['c']
        }
    },

    'space': {
        'multimachine': true,
        'timeout': 300,
        'syncserver': 'localhost',
        'machines': [{
            'name': 'localhost',
            'principal': true,
            'windows': ['awindow', 'bwindow', 'cwindow']
        }]
    }
};

exports.noviewports = {
    'windows': {
        'awindow': {
            'viewports': ['a']
        }
    }
};

exports.screenprotein = `
# peek - g-speak 3.26.4 (unknown), libYaml 0.1.6
%YAML 1.1
%TAG ! tag:oblong.com,2009:slaw/
--- !protein
descrips:
- visidrome
- screen-info
ingests:
  screens:
    feld1:
      type: basic
      cent: !vector [-1176.3800000000001, 375.0, 2615.2600000000002]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.81833265901755126, 0.0, -0.57474486442704686]
      over: !vector [-0.57474486442704675, 0.0, -0.81833265901755103]
      px-size: !vector [1975, 3448]
      px-origin: !vector [0, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-a
    feld2:
      type: basic
      cent: !vector [-1775.2634921666865, 375.0, 1762.561953779692]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.81833265901755126, 0.0, -0.57474486442704686]
      over: !vector [-0.57474486442704675, 0.0, -0.81833265901755103]
      px-size: !vector [1975, 3448]
      px-origin: !vector [1975, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-a
    feld3:
      type: basic
      cent: !vector [-2374.1500000000001, 375.0, 909.86000000000001]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.81833265901755126, 0.0, -0.57474486442704686]
      over: !vector [-0.57474486442704675, 0.0, -0.81833265901755103]
      px-size: !vector [1975, 3448]
      px-origin: !vector [3950, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-a
    feld4:
      type: basic
      cent: !vector [-2459.4780000000001, 375.0, -26.792000000000002]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.90627584144784201, 0.0, 0.42268676251806853]
      over: !vector [0.42268676251806847, 0.0, -0.90627584144784201]
      px-size: !vector [1975, 3448]
      px-origin: !vector [0, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-b
    feld5:
      type: basic
      cent: !vector [-2019.0385383638488, 375.0, -971.13184969013219]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.90627584144784201, 0.0, 0.42268676251806853]
      over: !vector [0.42268676251806847, 0.0, -0.90627584144784201]
      px-size: !vector [1975, 3448]
      px-origin: !vector [1975, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-b
    feld6:
      type: basic
      cent: !vector [-1578.5999999999999, 375.0, -1915.47]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.90627584144784201, 0.0, 0.42268676251806853]
      over: !vector [0.42268676251806847, 0.0, -0.90627584144784201]
      px-size: !vector [1975, 3448]
      px-origin: !vector [3950, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-b
    feld7:
      type: basic
      cent: !vector [-798.63, 375.0, -2410.23]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.0, 0.0, 1.0]
      over: !vector [1.0, 0.0, 0.0]
      px-size: !vector [1975, 3448]
      px-origin: !vector [0, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-c
    main:
      type: basic
      cent: !vector [243.37065277794773, 375.0, -2410.2271195716608]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.0, 0.0, 1.0]
      over: !vector [1.0, 0.0, 0.0]
      px-size: !vector [1975, 3448]
      px-origin: !vector [1975, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-c
    feld8:
      type: basic
      cent: !vector [1285.3699999999999, 375.0, -2410.23]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [0.0, 0.0, 1.0]
      over: !vector [1.0, 0.0, 0.0]
      px-size: !vector [1975, 3448]
      px-origin: !vector [3950, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-c
    feld9:
      type: basic
      cent: !vector [2161.71, 375.0, -1966.1600000000001]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [-0.80299325262260945, 0.0, 0.59598811753470571]
      over: !vector [0.5959881175347056, 0.0, 0.80299325262260945]
      px-size: !vector [1975, 3448]
      px-origin: !vector [0, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-d
    feld10:
      type: basic
      cent: !vector [2782.732903901695, 375.0, -1129.440464404368]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [-0.80299325262260945, 0.0, 0.59598811753470571]
      over: !vector [0.5959881175347056, 0.0, 0.80299325262260945]
      px-size: !vector [1975, 3448]
      px-origin: !vector [1975, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-d
    feld11:
      type: basic
      cent: !vector [3403.75, 375.0, -292.72000000000003]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [-0.80299325262260945, 0.0, 0.59598811753470571]
      over: !vector [0.5959881175347056, 0.0, 0.80299325262260945]
      px-size: !vector [1975, 3448]
      px-origin: !vector [3950, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-d
    feld12:
      type: basic
      cent: !vector [3482.3499999999999, 375.0, 639.60000000000002]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [-0.89621698401085403, 0.0, -0.44361595729920383]
      over: !vector [-0.44361595729920378, 0.0, 0.89621698401085403]
      px-size: !vector [1975, 3448]
      px-origin: !vector [0, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-e
    feld13:
      type: basic
      cent: !vector [3020.0993931477683, 375.0, 1573.4567296785701]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [-0.89621698401085403, 0.0, -0.44361595729920383]
      over: !vector [-0.44361595729920378, 0.0, 0.89621698401085403]
      px-size: !vector [1975, 3448]
      px-origin: !vector [1975, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-e
    feld14:
      type: basic
      cent: !vector [2557.8499999999999, 375.0, 2507.3099999999999]
      phys-size: !vector [1042.0, 1823.875]
      norm: !vector [-0.89621698401085403, 0.0, -0.44361595729920383]
      over: !vector [-0.44361595729920378, 0.0, 0.89621698401085403]
      px-size: !vector [1975, 3448]
      px-origin: !vector [3950, 0]
      eye-dist: 2954.7378280200001
      hostname: hex-e
...
`
    