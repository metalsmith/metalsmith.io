import Blazy from 'blazy';
import filter from './filter';
import cookieBanner from './cookiebanner';
import initSyntaxHighlighting from './syntax-highlighting';
import anchors from './anchors';
import initCodeTabs from './codetabs';
import scrollTop from './scrolltop';

/**
 * Initialize lazy image loading
 */

const blazy = new Blazy({
  validateDelay: 50,
  saveViewportOffsetDelay: 300,
  container: '.PluginList'
});

const pluginsPage = document.getElementsByClassName('Page--plugins')[0];

if (pluginsPage) {
  const input = document.querySelector('.PluginFilter-input');
  const updatePluginsView = () => {
    filter(input);
    blazy.revalidate();
  };

  const search = window.location.search.match(/[?&]search=([^&]*)/);
  if (search && search[1]) {
    input.value = search[1];
  }

  if (input) {
    updatePluginsView();
    input.addEventListener('keyup', updatePluginsView);
  }
}

if (document.getElementsByClassName('Page--anchors')[0]) {
  anchors();
}

if (document.getElementsByClassName('Page--docs')[0]) {
  const anchor = document.createElement('a');
  anchor.href = '#top';
  anchor.textContent = '↑';
  anchor.title = 'Back to top';
  document.body.appendChild(anchor);
  scrollTop();
}

cookieBanner();
initSyntaxHighlighting();
initCodeTabs(document.getElementsByClassName('CodeTabs'));
