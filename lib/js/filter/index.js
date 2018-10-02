var plugins = [];

/**
* Filter plugins
*/

var filter = function(input) {
  var value = input.value.toLowerCase();

  plugins.forEach(function(plugin) {
    var el = plugin.el;
    var title = plugin.title;
    var description = plugin.description;

    el.style.display = '';

    if (!value) {
      return;
    }
    if (!title.includes(value) && !description.includes(value)) {
      el.style.display = 'none';
    }
  });
};

/**
 * Build index
 */

Array.from(document.querySelectorAll('.Plugin-list .Plugin')).forEach(function(el) {
  plugins.push({
    el: el,
    title: el.querySelector('.Plugin-title').textContent.toLowerCase(),
    description: el.querySelector('.Plugin-description').textContent.toLowerCase()
  });
});

module.exports = filter;
