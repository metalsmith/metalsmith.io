'use strict';

require('./build')(function (err) {
  /* eslint no-console: 0 */
  if (err) {
    throw err;
  }
  console.log('Build succeeded!');
});
