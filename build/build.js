
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Main definitions.
 */

require.mains = {};

/**
 * Define a main.
 */

require.main = function(name, path){
  require.mains[name] = path;
};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if ('/' == path.charAt(0)) path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  if (require.mains[path]) {
    paths = [path + '/' + require.mains[path]];
  }

  for (var i = 0, len = paths.length; i < len; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) {
      return path;
    }
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0, len = path.length; i < len; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var root = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(root, path);
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};



require.register("metalsmith.io/index.js", Function("exports, require, module",
"\r\n\
var input = document.querySelector('.Plugin-filter-input');\r\n\
var plugins = [];\r\n\
\r\n\
/**\r\n\
 * Build index.\r\n\
 */\r\n\
\r\n\
[].forEach.call(document.querySelectorAll('.Plugin-list .Plugin'), function (el) {\r\n\
  plugins.push({\r\n\
    el: el,\r\n\
    title: el.querySelector('.Plugin-title').textContent.toLowerCase(),\r\n\
    description: el.querySelector('.Plugin-description').textContent.toLowerCase()\r\n\
  });\r\n\
});\r\n\
\r\n\
/**\r\n\
 * Filter to start, in case there is some text in the search input, which may\r\n\
 * happen when clicking \"back\" in the browser. And then set a listener for\r\n\
 * future filtering.\r\n\
 */\r\n\
\r\n\
filter();\r\n\
input.addEventListener('keyup', filter);\r\n\
\r\n\
/**\r\n\
 * Filter plugins.\r\n\
 */\r\n\
\r\n\
function filter() {\r\n\
  var value = input.value.toLowerCase();\r\n\
\r\n\
  plugins.forEach(function(plugin){\r\n\
    var el = plugin.el;\r\n\
    var title = plugin.title;\r\n\
    var desc = plugin.description;\r\n\
    plugin.el.style.display = '';\r\n\
\r\n\
    if (!value) return;\r\n\
    if (!~title.indexOf(value) && !~desc.indexOf(value)) {\r\n\
      el.style.display = 'none';\r\n\
    }\r\n\
  });\r\n\
}//@ sourceURL=metalsmith.io/index.js"
));





