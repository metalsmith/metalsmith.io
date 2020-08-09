var Blazy = require('blazy');
var hljs = require('highlight.js');
var filter = require('../lib/js/filter');

/**
 * Enable syntax highlighting
 */

hljs.initHighlightingOnLoad();

/**
 * Initialize lazy image loading
 */

var blazy = new Blazy({
  validateDelay: 300
});

/**
 * Plugin filter
 *
 * Filters at start, in case there is some text in the search input, which may happen when clicking
 * "back" in the browser. And then sets a listener for future filtering.
 */

var input = document.querySelector('.PluginFilter-input');

filter(input);

input.addEventListener('keyup', function () {
  filter(input);

  // Revalidate document for visible images
  blazy.revalidate();
});
