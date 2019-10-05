module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", "react-props"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "semi": [
            "error",
            "always"
        ],
        "keyword-spacing": [
            "error",
            {
                "after": true
            }
        ],
        "brace-style": [
            "error"
        ],
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1
    },
    "settings" : {
        "react": {
            "version" : "detect"
        }
    }
};