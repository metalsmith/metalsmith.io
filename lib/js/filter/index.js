const plugins = [];
const count = document.querySelector('.PluginHeader');

/**
 * Filter plugins
 */

function showPlugin(plugin) {
  const el = plugin.el;
  el.style.order = '';
  el.style.display = '';
}

const filter = function (input) {
  const value = input.value.toLowerCase();
  let matchCount = 0;

  if (!value) {
    plugins.forEach(showPlugin);
    count.textContent = plugins.length + ' registered plugins';
  } else {
    const exactMatchRegex = new RegExp('\b' + value + '\b', 'i');
    const filtered = [];

    plugins.forEach(function (plugin) {
      const el = plugin.el;
      const title = plugin.title;
      const desc = plugin.description;

      if (!title.includes(value) && !desc.includes(value) && !plugin.user.includes(value)) {
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
        // first compare exact word match on user
        if (a.user.match(exactMatchRegex)) return -1;
        if (b.user.match(exactMatchRegex)) return 1;
        // then find a partial match on user
        if (a.user.includes(value)) return -1;
        if (b.user.includes(value)) return 1;
        // else find exact match in description
        if (a.description.match(exactMatchRegex)) return -1;
        if (b.description.match(exactMatchRegex)) return -1;
        // or find a partial match in description
        if (a.description.includes(value)) return -1;
        if (b.description.includes(value)) return 1;
        // else alphabetically by title
        return a.title < b.title ? -1 : 1;
      })
      // show core plugins first
      .sort(function (a, b) {
        if (a.core) return -1;
        if (b.core) return 1;
        return 0;
      })
      .forEach(function (plugin, index) {
        const el = plugin.el;
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
    description: el.querySelector('.Plugin-description').textContent.toLowerCase(),
    core: el.classList.contains('Plugin--core'),
    user: el.querySelector('.Plugin-user').textContent
  });
});

export default filter;
