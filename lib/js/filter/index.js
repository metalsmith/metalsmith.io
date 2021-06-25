var plugins = [];
var count = document.querySelector('.PluginHeader');

/**
 * Filter plugins
 */

function showPlugin(plugin) {
  var el = plugin.el;
  el.style.order = '';
  el.style.display = '';
}

var filter = function (input) {
  var value = input.value.toLowerCase();
  var matchCount = 0;

  if (!value) {
    plugins.forEach(showPlugin);
    count.textContent = plugins.length + ' registered plugins';
  } else {
    var exactMatchRegex = new RegExp('\b' + value + '\b', 'i');
    var filtered = [];

    plugins.forEach(function (plugin) {
      var el = plugin.el;
      var title = plugin.title;
      var desc = plugin.description;

      if (!title.includes(value) && !desc.includes(value)) {
        el.style.display = 'none';
      } else {
        matchCount += 1;
        filtered.push(plugin);
      }
    });

    filtered
      .sort(function (a, b) {
        // first compare exact word match on title
        if (a.title.match(exactMatchRegex)) return -1;
        if (b.title.match(exactMatchRegex)) return 1;
        // then find a partial match on title
        if (a.title.includes(value)) return -1;
        if (b.title.includes(value)) return 1;
        // else find exact match in description
        if (a.description.match(exactMatchRegex)) return -1;
        if (b.description.match(exactMatchRegex)) return -1;
        // or find a partial match in description
        if (a.description.includes(value)) return -1;
        if (b.description.includes(value)) return 1;
        // else alphabetically by title
        return a.title < b.title ? -1 : 1;
      })
      .forEach(function (plugin, index) {
        var el = plugin.el;
        showPlugin(plugin);
        el.style.order = index;
      });

    if (!matchCount) {
      count.innerHTML = [
        'No matching plugin. Search on',
        '<a href="https://www.npmjs.com/search?q=' + encodeURIComponent(value) + '">NPM</a>',
        'or <a href="https://github.com/search?q=' + encodeURIComponent(value) + '">Github</a>?'
      ].join(' ');
    } else {
      count.textContent = matchCount + ' matching plugin' + (matchCount === 1 ? '' : 's');
    }
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
