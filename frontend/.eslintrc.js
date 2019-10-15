module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": ["airbnb"],
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
        "react", "jsx-a11y", "import"
    ],
    "parser": "babel-eslint",
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
        "react/jsx-uses-vars": 1,
        "react/jsx-filename-extension": 0,
        "react/destructuring-assignment": 0,
        "react/jsx-indent": 0,
        "react/jsx-one-expression-per-line": 0,
        "quotes": ["error", "double"]
    },
    "settings" : {
        "react": {
            "version" : "detect"
        }
    },
};