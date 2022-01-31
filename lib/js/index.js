import Blazy from 'blazy';
import filter from './filter';
import cookieBanner from './cookiebanner';
import initSyntaxHighlighting from './syntax-highlighting';
import anchors from './anchors';
/**
 * Initialize lazy image loading
 */

const blazy = new Blazy({
  validateDelay: 50,
  saveViewportOffsetDelay: 300,
  container: '.PluginList'
});

if (document.getElementsByClassName('Page--plugins')[0]) {
  const input = document.querySelector('.PluginFilter-input');
  const updatePluginsView = () => {
    filter(input);
    blazy.revalidate();
  };

  if (input) {
    updatePluginsView();
    input.addEventListener('keyup', updatePluginsView);
  }
}

if (document.getElementsByClassName('Page--anchors')[0]) {
  anchors();
}

cookieBanner();
initSyntaxHighlighting();
