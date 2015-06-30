var search  = document.querySelector('.Plugin-search input');
var plugins = [];

[].forEach.call(document.querySelectorAll('.Plugin-list .Plugin'), function (el) {
  plugins.push({
    el:    el,
    title: el.querySelector('.Plugin-title').textContent.toLowerCase(),
    desc:  el.querySelector('.Plugin-description').textContent.toLowerCase()
  });
});

search.addEventListener('keyup', function () {
  var value = this.value.toLowerCase();

  plugins.forEach(function (p) {
    var visible = (value == '') ||
                  (p.title.indexOf(value) !== -1 || p.desc.indexOf(value) !== -1);

    p.el.style.display = visible ? '' : 'none';
  });
});
