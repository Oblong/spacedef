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