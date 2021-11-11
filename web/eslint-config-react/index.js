const { tsRules, rules } = require('./react-app-clone')

module.exports = {
  extends: [
    require.resolve('./cra-base-clone'),
    require.resolve('./cra-jest-clone'),
    'prettier',
  ],
  plugins: [
    'import',
    'jsx-a11y',
    'react-hooks',
    'prettier',
    'jest',
    'jest-dom',
    'testing-library',
    'promise',
  ],

  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },

        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
      },
      plugins: ['@typescript-eslint'],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.

      rules: {
        ...tsRules,
        'react/no-unused-prop-types': ['off'],
        'no-redeclare': ['off'],
        '@typescript-eslint/no-redeclare': ['error'],
        'no-shadow': ['off'],
        '@typescript-eslint/no-shadow': [
          'error',
          {
            builtinGlobals: false,
            hoist: 'functions',
            allow: [],
            ignoreFunctionTypeParameterNameValueShadow: true,
          },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: false,
            },
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],
        '@typescript-eslint/no-misused-promises': ['error'],
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowNullableBoolean: true,
            allowNullableObject: true,
            allowString: false,
            allowNumber: false,
          },
        ],
        '@typescript-eslint/await-thenable': ['error'],
        '@typescript-eslint/consistent-type-imports': ['error'],
        '@typescript-eslint/no-confusing-non-null-assertion': ['error'],
        '@typescript-eslint/no-extra-non-null-assertion': ['error'],
        '@typescript-eslint/no-floating-promises': [
          'error',
          {
            ignoreVoid: true,
          },
        ],
        '@typescript-eslint/no-for-in-array': ['error'],
        '@typescript-eslint/no-misused-new': ['error'],
        '@typescript-eslint/no-non-null-asserted-optional-chain': ['error'],
        '@typescript-eslint/prefer-ts-expect-error': ['error'],
        '@typescript-eslint/prefer-string-starts-ends-with': ['error'],
        '@typescript-eslint/switch-exhaustiveness-check': ['error'],
        '@typescript-eslint/prefer-includes': ['error'],
        '@typescript-eslint/unified-signatures': ['error'],
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          { allowNumber: true, allowNullish: true, allowAny: true },
        ],
      },
    },
    {
      files: ['src/packlets/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              'lodash/*',
              'polished/*',
              // disallow absolute and direct imports from inside packlets, use relative imports
              'packlets/*',
              'packlets/*/*',
              'packlets/*/*/*',
              'pages/*',
              'gql/*',
              '__generated__/*',
            ],
          },
        ],
      },
    },
    {
      files: ['src/**/*.stories.tsx'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  rules: {
    ...rules,
    // React-Hooks
    'react-hooks/exhaustive-deps': ['error'], // Preliminary, should be error later

    // Prettier
    'prettier/prettier': ['error'],

    // Jest
    'jest/expect-expect': ['error'],
    'jest/no-commented-out-tests': ['error'],
    'jest/no-disabled-tests': ['error'],
    'jest/no-export': ['error'],
    'jest/no-focused-tests': ['error'],
    'jest/no-identical-title': ['error'],
    'jest/no-jest-import': ['error'],
    'jest/no-mocks-import': ['error'],
    'jest/no-jasmine-globals': ['error'],
    'jest/no-standalone-expect': ['error'],
    'jest/no-test-prefixes': ['error'],
    'jest/valid-expect': ['error'],
    'jest/valid-expect-in-promise': ['error'],

    // Import
    'import/export': ['error'],
    'import/no-named-as-default-member': ['error'],
    'import/no-mutable-exports': ['error'],
    'import/no-absolute-path': ['error'],
    'import/no-dynamic-require': ['error'],
    'import/no-named-default': ['error'],
    'import/no-self-import': ['error'],
    'import/no-useless-path-segments': ['error', { commonjs: true }],
    'import/newline-after-import': ['error'],
    'import/named': ['off'],

    'import/no-anonymous-default-export': ['error'],

    // a11y
    'jsx-a11y/control-has-associated-label': [
      'error',
      {
        labelAttributes: ['label'],
        controlComponents: [],
        ignoreElements: [
          'audio',
          'canvas',
          'embed',
          'input',
          'textarea',
          'tr',
          'video',
        ],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        depth: 5,
      },
    ],
    'jsx-a11y/click-events-have-key-events': ['error'],
    'jsx-a11y/html-has-lang': ['error'],
    'jsx-a11y/interactive-supports-focus': ['error'],
    'jsx-a11y/lang': ['error'],
    'jsx-a11y/media-has-caption': [
      'error',
      { audio: [], video: [], track: [] },
    ],
    'jsx-a11y/mouse-events-have-key-events': ['error'],
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
    'jsx-a11y/no-interactive-element-to-noninteractive-role': [
      'error',
      { tr: ['none', 'presentation'] },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
    'jsx-a11y/no-static-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
    'jsx-a11y/tabindex-no-positive': ['error'],
    'jsx-a11y/no-noninteractive-element-to-interactive-role': [
      'error',
      {
        ul: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid',
        ],
        ol: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid',
        ],
        li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
        table: ['grid'],
        td: ['gridcell'],
      },
    ],
    'jsx-a11y/no-noninteractive-tabindex': [
      'error',
      { tags: [], roles: ['tabpanel'] },
    ],

    // React
    'react/jsx-boolean-value': ['error', 'never', { always: [] }],
    'react/jsx-no-bind': [
      'error',
      {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
        ignoreDOMComponents: true,
      },
    ],
    'react/forbid-prop-types': ['error', { forbid: ['any'] }],
    'react/no-access-state-in-setstate': ['error'],
    'react/no-danger': ['error'],
    'react/no-deprecated': ['error'],
    'react/no-find-dom-node': ['error'],
    'react/no-redundant-should-component-update': ['error'],
    'react/no-render-return-value': ['error'],
    'react/no-string-refs': ['error'],
    'react/no-this-in-sfc': ['error'],
    'react/no-unknown-property': ['error'],
    'react/no-unused-prop-types': [
      'error',
      { customValidators: [], skipShapeProps: true },
    ],
    'react/no-unused-state': ['error'],
    'react/no-will-update-set-state': ['error'],
    'react/prefer-es6-class': ['error', 'always'],
    'react/self-closing-comp': ['error'],
    'react/void-dom-elements-no-children': ['error'],
    'react/jsx-curly-brace-presence': ['error', 'never'],

    // ESLint
    'constructor-super': ['error'],
    'func-names': ['error'],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: false },
    ],
    'no-class-assign': ['error'],
    'no-shadow': ['error'],
    'no-undef-init': ['error'],
    'no-var': ['error'],
    'object-shorthand': [
      'error',
      'always',
      { ignoreConstructors: false, avoidQuotes: true },
    ],
    'prefer-const': [
      'error',
      { destructuring: 'any', ignoreReadBeforeAssign: true },
    ],
    'prefer-numeric-literals': ['error'],
    'prefer-rest-params': ['error'],
    'prefer-spread': ['error'],
    'prefer-template': ['error'],
    'symbol-description': ['error'],
    'new-cap': [
      'error',
      {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: [
          'Immutable.Map',
          'Immutable.Set',
          'Immutable.List',
        ],
        properties: true,
      },
    ],
    'no-bitwise': ['error'],
    'no-continue': ['error'],
    'no-lonely-if': ['error'],
    'no-multi-assign': ['error'],
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'one-var': ['error', 'never'],
    'operator-assignment': ['error', 'always'],
    'spaced-comment': [
      'error',
      'always',
      {
        line: { exceptions: ['-', '+'], markers: ['=', '!'] },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!', ':', '::'],
          balanced: true,
        },
      },
    ],
    'block-scoped-var': ['error'],
    'dot-notation': ['error', { allowKeywords: true, allowPattern: '' }],
    'for-direction': ['error'],
    'guard-for-in': ['error'],
    'no-alert': ['error'],
    'no-async-promise-executor': ['error'],
    'no-await-in-loop': ['error'],
    'no-case-declarations': ['error'],
    'no-compare-neg-zero': ['error'],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-constant-condition': ['error'],
    'no-debugger': ['error'],
    'no-else-return': ['error', { allowElseIf: false }],
    'no-empty': ['error'],
    'no-empty-function': [
      'error',
      { allow: ['arrowFunctions', 'functions', 'methods'] },
    ],
    'no-extra-boolean-cast': ['error'],
    'no-global-assign': ['error', { exceptions: [] }],
    'no-inner-declarations': ['error'],
    'no-irregular-whitespace': ['error'],
    'no-misleading-character-class': ['error'],
    'no-new': ['error'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-prototype-builtins': ['error'],
    'no-return-assign': ['error', 'always'],
    'no-return-await': ['error'],
    'no-unsafe-finally': ['error'],
    'no-unsafe-negation': ['error'],
    'no-useless-catch': ['error'],
    'no-useless-return': ['error'],
    'no-void': [
      'error',
      {
        allowAsStatement: true, // INJECTION!
      },
    ],
    'vars-on-top': ['error'],
    yoda: ['error'],
    // ESLint v7
    'no-dupe-else-if': ['error'],
    'no-setter-return': ['error'],
    'consistent-return': ['error'],

    // jest-dom
    'jest-dom/prefer-checked': ['error'],
    'jest-dom/prefer-empty': ['error'],
    'jest-dom/prefer-enabled-disabled': ['error'],
    'jest-dom/prefer-focus': ['error'],
    'jest-dom/prefer-required': ['error'],
    'jest-dom/prefer-to-have-attribute': ['error'],
    'jest-dom/prefer-to-have-text-content': ['error'],

    // testing-library
    'testing-library/await-async-query': ['error'],
    'testing-library/await-async-utils': ['error'],
    'testing-library/no-await-sync-query': ['error'],
    'testing-library/no-debug': ['error'],
    'testing-library/no-dom-import': ['error'],
    'testing-library/no-manual-cleanup': ['error'],
    'testing-library/no-wait-for-empty-callback': ['error'],
    'testing-library/prefer-explicit-assert': ['error'],
    'testing-library/prefer-find-by': ['error'],
    'testing-library/prefer-presence-queries': ['error'],
    'testing-library/prefer-screen-queries': ['error'],
    'testing-library/prefer-wait-for': ['error'],

    // promise
    'promise/always-return': 'off',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-nesting': 'error',
    'promise/no-promise-in-callback': 'error',
    'promise/no-callback-in-promise': 'error',
    'promise/avoid-new': 'error',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'error',
    'promise/valid-params': 'error',

    // some custom
    'default-case': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // we have lodash and polished plugin in place, no reason to lodash/map
          'lodash/*',
          'polished/*',
          // disallow relative and direct imports from packlets
          '*/packlets',
          '*/*/packlets',
          '*/*/*/packlets',
          '*/*/*/*/packlets',
          'packlets/*/*',
          'packlets/*/*/*',
        ],
      },
    ],
    'import/no-default-export': 'error',
  },
}
