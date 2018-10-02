var filter = require('../lib/js/filter');

/**
 * Filter to start, in case there is some text in the search input, which may
 * happen when clicking "back" in the browser. And then set a listener for
 * future filtering.
 */

var input = document.querySelector('.Plugin-filter-input');

filter(input);

input.addEventListener('keyup', function() {
  filter(input);
});
