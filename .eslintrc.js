module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'standard',
        'plugin:node/recommended'
    ],
    plugins: ['node'],
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        semi: ['error', 'always']
    }
};
