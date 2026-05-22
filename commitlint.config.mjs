export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type must be one of these
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new feature
        'fix',      // bug fix
        'chore',    // maintenance, dependency updates, config changes
        'docs',     // documentation only
        'style',    // formatting, missing semicolons, no logic change
        'refactor', // code change that is neither fix nor feature
        'perf',     // performance improvement
        'test',     // adding or updating tests
        'build',    // build system or external dependency changes
        'ci',       // CI/CD configuration changes
        'revert',   // reverts a previous commit
      ],
    ],

    // scope is optional but must be lowercase if provided
    'scope-case': [2, 'always', 'lower-case'],

    // subject rules
    'subject-empty': [2, 'never'],             // subject is required
    'subject-full-stop': [2, 'never', '.'],    // no period at end
    'subject-case': [2, 'always', 'lower-case'], // lowercase subject

    // header max length
    'header-max-length': [2, 'always', 100],

    // body and footer are optional, no rules enforced
    'body-max-line-length': [1, 'always', 100], // warn only
  },
};
