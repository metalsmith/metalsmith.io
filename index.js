
var input = document.querySelector('.Plugin-filter-input');
var plugins = [];

/**
 * Build index.
 */

[].forEach.call(document.querySelectorAll('.Plugin-list .Plugin'), function (el) {
  plugins.push({
    el: el,
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

/**
 * Filter plugins.
 */

function filter() {
  var value = input.value.toLowerCase();

  plugins.forEach(function(plugin){
    var el = plugin.el;
    var title = plugin.title;
    var desc = plugin.description;
    plugin.el.style.display = '';

    if (!value) return;
    if (!~title.indexOf(value) && !~desc.indexOf(value)) {
      el.style.display = 'none';
    }
  });
}