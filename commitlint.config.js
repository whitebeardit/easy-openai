module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [0],
    'subject-full-stop': [0],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 1000],
    'footer-max-line-length': [2, 'always', 100],
  },
};
