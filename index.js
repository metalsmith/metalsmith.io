var search  = document.querySelector('.Plugin-search input');
var plugins = [];

[].forEach.call(document.querySelectorAll('.Plugin-list .Plugin'), function (el) {
  plugins.push({
    el:    el,
    title: el.querySelector('.Plugin-title').textContent.toLowerCase(),
    desc:  el.querySelector('.Plugin-description').textContent.toLowerCase()
  });
});

function filterPlugins() {
  var value = this.value.toLowerCase();

  plugins.forEach(function (p) {
    var visible = (value == '') ||
                  (p.title.indexOf(value) !== -1 || p.desc.indexOf(value) !== -1);

    p.el.style.display = visible ? '' : 'none';
  });
}

// Set keyup event
search.addEventListener('keyup', filterPlugins);

// Do a first filtering in case there is some text in the search input
// this may happen when clicking back in the browser
filterPlugins.call(search);
