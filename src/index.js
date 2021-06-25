var Blazy = require('blazy');
var filter = require('../lib/js/filter');

/**
 * Initialize lazy image loading
 */

var blazy = new Blazy({
  validateDelay: 50,
  saveViewportOffsetDelay: 300,
  container: '.PluginList'
});

/**
 * Plugin filter
 *
 * Filters at start, in case there is some text in the search input, which may happen when clicking
 * "back" in the browser. And then sets a listener for future filtering.
 */

var input = document.querySelector('.PluginFilter-input');
function updatePluginsView() {
  filter(input);
  blazy.revalidate();
}

if (input) {
  updatePluginsView();
  input.addEventListener('keyup', updatePluginsView);
}
