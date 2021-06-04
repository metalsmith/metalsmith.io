var plugins = [];
var count = document.querySelector('.PluginHeader');

/**
 * Filter plugins
 */

function showPlugin(plugin) {
  var el = plugin.el;
  el.style.display = '';
}

var filter = function (input) {
  var value = input.value.toLowerCase();
  var matchCount = 0;

  if (!value) {
    plugins.forEach(showPlugin);
    count.textContent = plugins.length + ' registered plugins';
  } else {
    plugins.forEach(function (plugin) {
      var el = plugin.el;
      var title = plugin.title;
      var desc = plugin.description;

      if (!title.includes(value) && !desc.includes(value)) {
        el.style.display = 'none';
      } else {
        matchCount += 1;
        showPlugin(plugin);
      }
    });
    count.textContent =
      (matchCount === 0 ? 'No' : matchCount) + ' matching plugin' + (matchCount === 1 ? '' : 's');
  }
};

/**
 * Build index
 */

Array.prototype.slice.call(document.querySelectorAll('.PluginList .Plugin')).forEach(function (el) {
  plugins.push({
    el: el,
    title: el.querySelector('.Plugin-title').textContent.toLowerCase(),
    description: el.querySelector('.Plugin-description').textContent.toLowerCase()
  });
});

module.exports = filter;
