// eslint-disable-next-line no-undef
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        'no-multi-spaces': ['error'],
        'no-duplicate-imports': 'error',
        curly: [2, 'multi-line'],
        'array-bracket-newline': ['error', 'consistent'],
        'array-bracket-spacing': ['error', 'never'],
        'array-element-newline': ['error', 'consistent'],
        'function-call-argument-newline': ['error', 'consistent'],
        'function-paren-newline': ['error', 'consistent'],
        'implicit-arrow-linebreak': ['error', 'beside'],
        'func-call-spacing': ['error', 'never'],
        'linebreak-style': 0,
        'newline-per-chained-call': 'error',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
                // maxEOF: 0,
                // maxBOF: 1,
            },
        ],
    // 'no-console': 0,
    // 'no-empty-function': 'error',
    // 'comma-spacing': [
    //     'error',
    //     {
    //         before: false,
    //         after: true,
    //     },
    // ],
    // 'comma-style': ['error', 'last'],
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
};