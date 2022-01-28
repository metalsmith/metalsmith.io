import Blazy from 'blazy';
import filter from './filter';
import cookieBanner from './cookiebanner';
import initSyntaxHighlighting from './syntax-highlighting';
/**
 * Initialize lazy image loading
 */

const blazy = new Blazy({
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

const input = document.querySelector('.PluginFilter-input');
function updatePluginsView() {
  filter(input);
  blazy.revalidate();
}

if (input) {
  updatePluginsView();
  input.addEventListener('keyup', updatePluginsView);
}

cookieBanner();

initSyntaxHighlighting();
