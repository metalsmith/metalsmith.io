/* eslint-env browser */

const plugins = [];

/**
* Filter plugins.
*/

const filter = input => {
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

module.exports = filter;