'use strict';
/* eslint-env browser */

const input = document.querySelector('.Plugin-filter-input');
const plugins = [];

/**
* Filter plugins.
*/
const filter = () => {
  let value = input.value.toLowerCase();

  plugins.forEach((plugin) => {
    const { el, title, description } = plugin;

    el.style.display = '';

    if (!value) {
      return;
    }
    if (!~title.indexOf(value) && !~description.indexOf(value)) {
      el.style.display = 'none';
    }
  });
};


/**
 * Build index.
 */
Array.from(document.querySelectorAll('.Plugin-list .Plugin')).forEach((el) => {
  plugins.push({
    el,
    title: el.querySelector('.Plugin-title').textContent.toLowerCase(),
    description: el.querySelector('.Plugin-description').textContent.toLowerCase()
  });
});


/**
 * Filter to start, in case there is some text in the search input, which may
 * happen when clicking "back" in the browser. And then set a listener for
 * future filtering.
 */
filter();
input.addEventListener('keyup', filter);
