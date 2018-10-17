'use strict';

require('./build')((err) => {
  /* eslint no-console: 0 */
  if (err) {
    throw err;
  }
  console.log('Build succeeded!');
});
