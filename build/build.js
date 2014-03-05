
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

require.register("component-escape-html/index.js", Function("exports, require, module",
"/**\n\
 * Escape special characters in the given string of html.\n\
 *\n\
 * @param  {String} html\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
module.exports = function(html) {\n\
  return String(html)\n\
    .replace(/&/g, '&amp;')\n\
    .replace(/\"/g, '&quot;')\n\
    .replace(/'/g, '&#39;')\n\
    .replace(/</g, '&lt;')\n\
    .replace(/>/g, '&gt;');\n\
}\n\
//@ sourceURL=component-escape-html/index.js"
));
require.register("segmentio-highlight/lib/index.js", Function("exports, require, module",
"\n\
var escape = require(\"component-escape-html\");\n\
\n\
/**\n\
 * Expose `Highlight`.\n\
 */\n\
\n\
module.exports = Highlight;\n\
\n\
/**\n\
 * Initialize a new `Highlight` instance.\n\
 */\n\
\n\
function Highlight(){\n\
  if (!(this instanceof Highlight)) return new Highlight();\n\
  this.languages = {};\n\
  this.prefix('Highlight-');\n\
}\n\
\n\
/**\n\
 * Use a `plugin` function.\n\
 *\n\
 * @param {Function} plugin\n\
 * @return {Highlight}\n\
 */\n\
\n\
Highlight.prototype.use = function(plugin){\n\
  plugin(this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Get or set the highlighted class `prefix`.\n\
 *\n\
 * @param {String} prefix\n\
 * @return {Highlight or String}\n\
 */\n\
\n\
Highlight.prototype.prefix = function(prefix){\n\
  if (!arguments.length) return this._prefix;\n\
  this._prefix = prefix;\n\
  return this;\n\
}\n\
\n\
/**\n\
 * Define a new `language` with a `grammar`.\n\
 *\n\
 * @param {String} language\n\
 * @param {Object} grammar\n\
 * @return {Highlight}\n\
 */\n\
\n\
Highlight.prototype.language = function(language, grammar){\n\
  this.languages[language] = grammar;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Highlight an HTML `string` of a given `language`.\n\
 *\n\
 * @param {String} string\n\
 * @param {String} language\n\
 * @return {String}\n\
 */\n\
\n\
Highlight.prototype.string = function(string, language){\n\
  var ast = this.parse(string, language);\n\
  var str = this.stringify(ast);\n\
  return str;\n\
};\n\
\n\
/**\n\
 * Highlight an `el`, with optional `language`.\n\
 *\n\
 * @param {Element or String} el\n\
 * @param {String} language (optional)\n\
 */\n\
\n\
Highlight.prototype.element = function(el, language){\n\
  if ('string' == typeof el) el = document.querySelector(el);\n\
  var str = this.string(el.textContent, language || lang(el));\n\
  el.innerHTML = str;\n\
};\n\
\n\
/**\n\
 * Highlight an array of `els`, with optional `language`.\n\
 *\n\
 * @param {Array or String} els\n\
 * @param {String} language (optional)\n\
 */\n\
\n\
Highlight.prototype.elements = function(els, language){\n\
  if ('string' == typeof els) els = document.querySelectorAll(els);\n\
  for (var i = 0, el; el = els[i]; i++) this.element(el, language);\n\
};\n\
\n\
/**\n\
 * Highlight all elements in the DOM with language attributes.\n\
 */\n\
\n\
Highlight.prototype.all = function(){\n\
  this.elements(document.querySelectorAll('[data-language]'));\n\
  this.elements(document.querySelectorAll('[class*=\"language-\"]'));\n\
  this.elements(document.querySelectorAll('[class*=\"lang-\"]'));\n\
};\n\
\n\
/**\n\
 * Parse a `string` with a given language's `grammar`, returning an AST.\n\
 *\n\
 * @param {String} string\n\
 * @param {String or Object} grammar\n\
 * @return {Array}\n\
 */\n\
\n\
Highlight.prototype.parse = function(string, grammar){\n\
  if ('string' == typeof grammar) {\n\
    var lang = grammar;\n\
    grammar = this.languages[lang];\n\
    if (!grammar) throw new Error('unknown language \"' + lang + '\"');\n\
  }\n\
\n\
  if (!grammar) throw new Error('must provide a grammar');\n\
  if (!string) return [];\n\
  var ret = [string];\n\
\n\
  for (var key in grammar) {\n\
    var rule = grammar[key];\n\
    var regexp = rule.pattern || rule;\n\
\n\
    for (var i = 0; i < ret.length; i++) {\n\
      var str = ret[i];\n\
      if ('object' == typeof str) continue;\n\
      var m = regexp.exec(str);\n\
      if (!m) continue;\n\
\n\
      var contents = m[0];\n\
      var before = str.slice(0, m.index);\n\
      var after = str.slice(m.index + contents.length);\n\
      var args = [i, 1];\n\
      var token = {\n\
        type: key,\n\
        value: rule.children ? this.parse(contents, rule.children) : contents\n\
      };\n\
\n\
      if (before) args.push(before);\n\
      args.push(token);\n\
      if (after) args.push(after);\n\
      ret.splice.apply(ret, args);\n\
    }\n\
  }\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Stringify a given `ast`.\n\
 *\n\
 * @param {Array} ast\n\
 * @return {String}\n\
 */\n\
\n\
Highlight.prototype.stringify = function(ast){\n\
  var prefix = this.prefix();\n\
  var self = this;\n\
\n\
  return ast.map(function(t){\n\
    if ('string' == typeof t) return escape(t);\n\
    var type = t.type;\n\
    var value = 'object' == typeof t.value\n\
      ? self.stringify(t.value)\n\
      : escape(t.value);\n\
    return '<span class=\"' + prefix + type + '\">' + value + '</span>';\n\
  }).join('');\n\
};\n\
\n\
/**\n\
 * Language class matcher.\n\
 */\n\
\n\
var matcher = /\\blang(?:uage)?-(\\w+)\\b/i;\n\
\n\
/**\n\
 * Get the code language for a given `el`. First look for a `data-language`\n\
 * attribute, then a `language-*` class, then search up the DOM tree for them.\n\
 *\n\
 * @param {Element} el\n\
 * @return {String}\n\
 */\n\
\n\
function lang(el){\n\
  if (!el) return;\n\
  var m;\n\
  if (el.hasAttribute('data-language')) return el.getAttribute('data-language');\n\
  if (m = matcher.exec(el.className)) return m[1];\n\
  return language(el.parentNode);\n\
}//@ sourceURL=segmentio-highlight/lib/index.js"
));
require.main("segmentio-highlight", "lib/index.js")
require.register("segmentio-highlight-javascript/lib/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `plugin`.\n\
 */\n\
\n\
module.exports = plugin;\n\
\n\
/**\n\
 * Plugin to highlight Javascript code.\n\
 *\n\
 * @param {Highlight} highlight\n\
 */\n\
\n\
function plugin(highlight){\n\
  highlight\n\
    .language('javascript', grammar)\n\
    .language('js', grammar);\n\
}\n\
\n\
/**\n\
 * Grammar.\n\
 */\n\
\n\
var grammar = {};\n\
\n\
/**\n\
 * Booleans.\n\
 */\n\
\n\
grammar.boolean = /\\b(true|false)\\b/;\n\
\n\
/**\n\
 * Booleans.\n\
 */\n\
\n\
grammar.comment = /(?!\\\\{2})(\\/\\*[\\w\\W]*?\\*\\/|\\/\\/.*?$)/m;\n\
\n\
/**\n\
 * Keywords.\n\
 */\n\
\n\
grammar.keyword = /\\b(break|catch|continue|delete|do|else|finally|for|function|if|in|instanceof|let|new|null|return|this|self|throw|try|typeof|var|while|with|yield)\\b/;\n\
\n\
/**\n\
 * Functions.\n\
 *\n\
 * Children are set separately to maintain ordering.\n\
 */\n\
\n\
grammar.function = {\n\
  pattern: /(\\w+)\\(/,\n\
  children: {}\n\
};\n\
\n\
grammar.function.children.class = /([A-Z]\\w*)/;\n\
grammar.function.children.function = /(\\w+)/;\n\
grammar.function.children.punctuation = /\\(/;\n\
\n\
/**\n\
 * Numbers.\n\
 */\n\
\n\
grammar.number = /\\b-?(0x[\\dA-Fa-f]+|\\d*\\.?\\d+([Ee]-?\\d+)?|NaN|-?Infinity)\\b/;\n\
\n\
/**\n\
 * Strings.\n\
 */\n\
\n\
grammar.string = /((\"|')(\\\\?.)*?\\2)/;\n\
\n\
/**\n\
 * Operators.\n\
 */\n\
\n\
grammar.operator = /([-+]{1,2}|!|&lt;=?|>=?|={1,3}|&lt;{1,2}|>{1,2}|(&amp;){1,2}|\\|{1,2}|\\?|\\*|\\/|\\~|\\^|\\%)/;\n\
\n\
/**\n\
 * Punctuation.\n\
 */\n\
\n\
grammar.punctuation = /[{}[\\];(),.:]/;//@ sourceURL=segmentio-highlight-javascript/lib/index.js"
));
require.main("segmentio-highlight-javascript", "lib/index.js")


require.register("component-indexof/index.js", Function("exports, require, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};//@ sourceURL=component-indexof/index.js"
));
require.register("component-classes/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require(\"component-indexof\");\n\
\n\
/**\n\
 * Whitespace regexp.\n\
 */\n\
\n\
var re = /\\s+/;\n\
\n\
/**\n\
 * toString reference.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Wrap `el` in a `ClassList`.\n\
 *\n\
 * @param {Element} el\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(el){\n\
  return new ClassList(el);\n\
};\n\
\n\
/**\n\
 * Initialize a new ClassList for `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @api private\n\
 */\n\
\n\
function ClassList(el) {\n\
  if (!el) throw new Error('A DOM element reference is required');\n\
  this.el = el;\n\
  this.list = el.classList;\n\
}\n\
\n\
/**\n\
 * Add class `name` if not already present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.add = function(name){\n\
  // classList\n\
  if (this.list) {\n\
    this.list.add(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (!~i) arr.push(name);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove class `name` when present, or\n\
 * pass a regular expression to remove\n\
 * any which match.\n\
 *\n\
 * @param {String|RegExp} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.remove = function(name){\n\
  if ('[object RegExp]' == toString.call(name)) {\n\
    return this.removeMatching(name);\n\
  }\n\
\n\
  // classList\n\
  if (this.list) {\n\
    this.list.remove(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (~i) arr.splice(i, 1);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove all classes matching `re`.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {ClassList}\n\
 * @api private\n\
 */\n\
\n\
ClassList.prototype.removeMatching = function(re){\n\
  var arr = this.array();\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (re.test(arr[i])) {\n\
      this.remove(arr[i]);\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Toggle class `name`, can force state via `force`.\n\
 *\n\
 * For browsers that support classList, but do not support `force` yet,\n\
 * the mistake will be detected and corrected.\n\
 *\n\
 * @param {String} name\n\
 * @param {Boolean} force\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.toggle = function(name, force){\n\
  // classList\n\
  if (this.list) {\n\
    if (\"undefined\" !== typeof force) {\n\
      if (force !== this.list.toggle(name, force)) {\n\
        this.list.toggle(name); // toggle again to correct\n\
      }\n\
    } else {\n\
      this.list.toggle(name);\n\
    }\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  if (\"undefined\" !== typeof force) {\n\
    if (!force) {\n\
      this.remove(name);\n\
    } else {\n\
      this.add(name);\n\
    }\n\
  } else {\n\
    if (this.has(name)) {\n\
      this.remove(name);\n\
    } else {\n\
      this.add(name);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return an array of classes.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.array = function(){\n\
  var str = this.el.className.replace(/^\\s+|\\s+$/g, '');\n\
  var arr = str.split(re);\n\
  if ('' === arr[0]) arr.shift();\n\
  return arr;\n\
};\n\
\n\
/**\n\
 * Check if class `name` is present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.has =\n\
ClassList.prototype.contains = function(name){\n\
  return this.list\n\
    ? this.list.contains(name)\n\
    : !! ~index(this.array(), name);\n\
};\n\
//@ sourceURL=component-classes/index.js"
));
require.register("stagas-infinite-carousel/index.js", Function("exports, require, module",
"\n\
/**\n\
 * infinite-carousel\n\
 *\n\
 * fork of: tomerdmnt/carousel\n\
 *\n\
 * licence MIT\n\
 */\n\
\n\
var classes = require(\"component-classes\");\n\
\n\
module.exports = Carousel;\n\
\n\
function isCarouselItem(elem) {\n\
  return elem && elem.nodeName === 'LI';\n\
}\n\
\n\
function nextSibling(item) {\n\
  do {\n\
    item = item.nextSibling;\n\
  } while (item && !isCarouselItem(item));\n\
\n\
  return item;\n\
}\n\
\n\
function prevSibling(item) {\n\
  do {\n\
    item = item.previousSibling;\n\
  } while (item && !isCarouselItem(item))\n\
\n\
  return item;\n\
}\n\
\n\
function Carousel(el, opts) {\n\
  if (!(this instanceof Carousel)) return new Carousel(el, opts);\n\
  opts = opts || {};\n\
  this.el = el;\n\
  classes(el).add('carousel');\n\
\n\
  var first = this.first()\n\
  this.rearrange(first);\n\
  this.show(first);\n\
}\n\
\n\
Carousel.prototype.list = function () {\n\
  return this.el.querySelector('ul');\n\
}\n\
\n\
Carousel.prototype.first = function () {\n\
  return this.el.querySelector('li');\n\
}\n\
\n\
Carousel.prototype.last = function () {\n\
  var arr = this.el.querySelectorAll('li');\n\
  return arr[arr.length-1];\n\
}\n\
\n\
Carousel.prototype.active = function () {\n\
  return this.el.querySelector('li.carousel-active');\n\
}\n\
\n\
Carousel.prototype.forEach = function (cb) {\n\
  var item = this.first()\n\
  while (item) {\n\
    cb(item);\n\
    item = nextSibling(item);\n\
  }\n\
}\n\
\n\
Carousel.prototype.next = function () {\n\
  var current = this.active();\n\
  var next = nextSibling(current);\n\
\n\
  this.show(next);\n\
\n\
  return next;\n\
}\n\
\n\
Carousel.prototype.prev = function () {\n\
  var current = this.active();\n\
  var prev = prevSibling(current);\n\
\n\
  this.show(prev);\n\
\n\
  return prev;\n\
}\n\
\n\
Carousel.prototype.getSiblings = function (item) {\n\
  var next = nextSibling(item);\n\
  var prev = prevSibling(item);\n\
  if (!next) {\n\
    next = this.first();\n\
  }\n\
  if (!prev) {\n\
    prev = this.last();\n\
  }\n\
  return { next: next, prev: prev };  \n\
}\n\
\n\
Carousel.prototype.rearrange = function (item) {\n\
  if (!nextSibling(item)) {\n\
    this.list().insertBefore(item, this.first());\n\
    this.list().insertBefore(this.last(), this.first());\n\
  }\n\
  if (!prevSibling(item)) {\n\
    this.list().appendChild(item);\n\
    this.list().appendChild(this.first());\n\
  }\n\
}\n\
\n\
Carousel.prototype.show = function (item) {\n\
  if (!item) return;\n\
\n\
  var sib = this.getSiblings(item);\n\
\n\
  this.forEach(function (ci) {\n\
    classes(ci)\n\
      .remove('carousel-next')\n\
      .remove('carousel-prev')\n\
      .remove('carousel-active');\n\
  });\n\
\n\
  classes(sib.next).add('carousel-next');\n\
  classes(sib.prev).add('carousel-prev');\n\
  classes(item).add('carousel-active');\n\
\n\
  setTimeout(function (self) {\n\
    self.rearrange(item)\n\
  }, 600, this)\n\
}\n\
//@ sourceURL=stagas-infinite-carousel/index.js"
));
require.register("timoxley-next-tick/index.js", Function("exports, require, module",
"\"use strict\"\n\
\n\
if (typeof setImmediate == 'function') {\n\
  module.exports = function(f){ setImmediate(f) }\n\
}\n\
// legacy node.js\n\
else if (typeof process != 'undefined' && typeof process.nextTick == 'function') {\n\
  module.exports = process.nextTick\n\
}\n\
// fallback for other environments / postMessage behaves badly on IE8\n\
else if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {\n\
  module.exports = function(f){ setTimeout(f) };\n\
} else {\n\
  var q = [];\n\
\n\
  window.addEventListener('message', function(){\n\
    var i = 0;\n\
    while (i < q.length) {\n\
      try { q[i++](); }\n\
      catch (e) {\n\
        q = q.slice(i);\n\
        window.postMessage('tic!', '*');\n\
        throw e;\n\
      }\n\
    }\n\
    q.length = 0;\n\
  }, true);\n\
\n\
  module.exports = function(fn){\n\
    if (!q.length) window.postMessage('tic!', '*');\n\
    q.push(fn);\n\
  }\n\
}\n\
//@ sourceURL=timoxley-next-tick/index.js"
));
require.register("tomerdmnt-carousel/index.js", Function("exports, require, module",
"var classes = require(\"component-classes\");\n\
\n\
module.exports = Carousel;\n\
\n\
function isCarouselItem(elem) {\n\
  return elem && elem.nodeName === 'DIV';\n\
}\n\
\n\
function nextSibling(item) {\n\
  do {\n\
    item = item.nextSibling;\n\
  } while (item && !isCarouselItem(item));\n\
\n\
  return item;\n\
}\n\
\n\
function prevSibling(item) {\n\
  do {\n\
    item = item.previousSibling;\n\
  } while (item && !isCarouselItem(item))\n\
\n\
  return item;\n\
}\n\
\n\
function Carousel(el, opts) {\n\
  if (!(this instanceof Carousel)) return new Carousel(el, opts);\n\
  opts = opts || {};\n\
  this.el = el;\n\
  classes(el).add('carousel');\n\
\n\
  this._show(this.el.querySelector('.carousel > div'));\n\
}\n\
\n\
Carousel.prototype.forEach = function (cb) {\n\
  var item = this.el.querySelector('div');\n\
  while (item) {\n\
    cb(item);\n\
    item = nextSibling(item);\n\
  }\n\
}\n\
\n\
Carousel.prototype.next = function () {\n\
  var current = this.el.querySelector('.carousel-visible');\n\
  var next = nextSibling(current);\n\
  this._show(next);\n\
\n\
  return next;\n\
}\n\
\n\
Carousel.prototype.prev = function () {\n\
  var current = this.el.querySelector('.carousel-visible');\n\
  var prev = prevSibling(current);\n\
  this._show(prev);\n\
\n\
  return prev;\n\
}\n\
\n\
Carousel.prototype._show = function (item) {\n\
  if (!item) return;\n\
  var next = nextSibling(item);\n\
  var prev = prevSibling(item);\n\
\n\
  this.forEach(function (ci) {\n\
    classes(ci)\n\
      .remove('carousel-next')\n\
      .remove('carousel-prev')\n\
      .remove('carousel-visible');\n\
  });\n\
\n\
  if (next) classes(next).add('carousel-next');\n\
  if (prev) classes(prev).add('carousel-prev');\n\
  classes(item).add('carousel-visible');\n\
}\n\
\n\
//@ sourceURL=tomerdmnt-carousel/index.js"
));
require.register("component-inherit/index.js", Function("exports, require, module",
"\n\
module.exports = function(a, b){\n\
  var fn = function(){};\n\
  fn.prototype = b.prototype;\n\
  a.prototype = new fn;\n\
  a.prototype.constructor = a;\n\
};//@ sourceURL=component-inherit/index.js"
));
require.register("tomerdmnt-carousel-slide/index.js", Function("exports, require, module",
"var Carousel = require(\"tomerdmnt-carousel\")\n\
  , inherit = require(\"component-inherit\")\n\
  , classes = require(\"component-classes\");\n\
\n\
module.exports = CarouselSlide;\n\
inherit(CarouselSlide, Carousel);\n\
\n\
function CarouselSlide(el, opts) {\n\
  if (!(this instanceof CarouselSlide)) return new CarouselSlide(el, opts);\n\
  Carousel.call(this, el, opts);\n\
\n\
  this.forEach(function (item) {\n\
    setTimeout(function () {\n\
      classes(item).add('carousel-slide');\n\
    }, 0);\n\
  })\n\
}\n\
//@ sourceURL=tomerdmnt-carousel-slide/index.js"
));












require.register("component-props/index.js", Function("exports, require, module",
"/**\n\
 * Global Names\n\
 */\n\
\n\
var globals = /\\b(Array|Date|Object|Math|JSON)\\b/g;\n\
\n\
/**\n\
 * Return immediate identifiers parsed from `str`.\n\
 *\n\
 * @param {String} str\n\
 * @param {String|Function} map function or prefix\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(str, fn){\n\
  var p = unique(props(str));\n\
  if (fn && 'string' == typeof fn) fn = prefixed(fn);\n\
  if (fn) return map(str, p, fn);\n\
  return p;\n\
};\n\
\n\
/**\n\
 * Return immediate identifiers in `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function props(str) {\n\
  return str\n\
    .replace(/\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\//g, '')\n\
    .replace(globals, '')\n\
    .match(/[a-zA-Z_]\\w*/g)\n\
    || [];\n\
}\n\
\n\
/**\n\
 * Return `str` with `props` mapped with `fn`.\n\
 *\n\
 * @param {String} str\n\
 * @param {Array} props\n\
 * @param {Function} fn\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function map(str, props, fn) {\n\
  var re = /\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\/|[a-zA-Z_]\\w*/g;\n\
  return str.replace(re, function(_){\n\
    if ('(' == _[_.length - 1]) return fn(_);\n\
    if (!~props.indexOf(_)) return _;\n\
    return fn(_);\n\
  });\n\
}\n\
\n\
/**\n\
 * Return unique array.\n\
 *\n\
 * @param {Array} arr\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function unique(arr) {\n\
  var ret = [];\n\
\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (~ret.indexOf(arr[i])) continue;\n\
    ret.push(arr[i]);\n\
  }\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Map with prefix `str`.\n\
 */\n\
\n\
function prefixed(str) {\n\
  return function(_){\n\
    return str + _;\n\
  };\n\
}\n\
//@ sourceURL=component-props/index.js"
));
require.register("component-to-function/index.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var expr = require(\"component-props\");\n\
\n\
/**\n\
 * Expose `toFunction()`.\n\
 */\n\
\n\
module.exports = toFunction;\n\
\n\
/**\n\
 * Convert `obj` to a `Function`.\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function toFunction(obj) {\n\
  switch ({}.toString.call(obj)) {\n\
    case '[object Object]':\n\
      return objectToFunction(obj);\n\
    case '[object Function]':\n\
      return obj;\n\
    case '[object String]':\n\
      return stringToFunction(obj);\n\
    case '[object RegExp]':\n\
      return regexpToFunction(obj);\n\
    default:\n\
      return defaultToFunction(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Default to strict equality.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function defaultToFunction(val) {\n\
  return function(obj){\n\
    return val === obj;\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert `re` to a function.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function regexpToFunction(re) {\n\
  return function(obj){\n\
    return re.test(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert property `str` to a function.\n\
 *\n\
 * @param {String} str\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function stringToFunction(str) {\n\
  // immediate such as \"> 20\"\n\
  if (/^ *\\W+/.test(str)) return new Function('_', 'return _ ' + str);\n\
\n\
  // properties such as \"name.first\" or \"age > 18\" or \"age > 18 && age < 36\"\n\
  return new Function('_', 'return ' + get(str));\n\
}\n\
\n\
/**\n\
 * Convert `object` to a function.\n\
 *\n\
 * @param {Object} object\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function objectToFunction(obj) {\n\
  var match = {}\n\
  for (var key in obj) {\n\
    match[key] = typeof obj[key] === 'string'\n\
      ? defaultToFunction(obj[key])\n\
      : toFunction(obj[key])\n\
  }\n\
  return function(val){\n\
    if (typeof val !== 'object') return false;\n\
    for (var key in match) {\n\
      if (!(key in val)) return false;\n\
      if (!match[key](val[key])) return false;\n\
    }\n\
    return true;\n\
  }\n\
}\n\
\n\
/**\n\
 * Built the getter function. Supports getter style functions\n\
 *\n\
 * @param {String} str\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function get(str) {\n\
  var props = expr(str);\n\
  if (!props.length) return '_.' + str;\n\
\n\
  var val;\n\
  for(var i = 0, prop; prop = props[i]; i++) {\n\
    val = '_.' + prop;\n\
    val = \"('function' == typeof \" + val + \" ? \" + val + \"() : \" + val + \")\";\n\
    str = str.replace(new RegExp(prop, 'g'), val);\n\
  }\n\
\n\
  return str;\n\
}\n\
//@ sourceURL=component-to-function/index.js"
));
require.register("component-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var type = require(\"component-type\");\n\
var toFunction = require(\"component-to-function\");\n\
\n\
/**\n\
 * HOP reference.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Iterate the given `obj` and invoke `fn(val, i)`\n\
 * in optional context `ctx`.\n\
 *\n\
 * @param {String|Array|Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} [ctx]\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn, ctx){\n\
  fn = toFunction(fn);\n\
  ctx = ctx || this;\n\
  switch (type(obj)) {\n\
    case 'array':\n\
      return array(obj, fn, ctx);\n\
    case 'object':\n\
      if ('number' == typeof obj.length) return array(obj, fn, ctx);\n\
      return object(obj, fn, ctx);\n\
    case 'string':\n\
      return string(obj, fn, ctx);\n\
  }\n\
};\n\
\n\
/**\n\
 * Iterate string chars.\n\
 *\n\
 * @param {String} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function string(obj, fn, ctx) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn.call(ctx, obj.charAt(i), i);\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate object keys.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn, ctx) {\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      fn.call(ctx, key, obj[key]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate array-ish.\n\
 *\n\
 * @param {Array|Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn, ctx) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn.call(ctx, obj[i], i);\n\
  }\n\
}\n\
//@ sourceURL=component-each/index.js"
));
require.register("component-type/index.js", Function("exports, require, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
//@ sourceURL=component-type/index.js"
));
require.register("yields-unserialize/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Unserialize the given \"stringified\" javascript.\n\
 * \n\
 * @param {String} val\n\
 * @return {Mixed}\n\
 */\n\
\n\
module.exports = function(val){\n\
  try {\n\
    return JSON.parse(val);\n\
  } catch (e) {\n\
    return val || undefined;\n\
  }\n\
};\n\
//@ sourceURL=yields-unserialize/index.js"
));
require.register("yields-store/index.js", Function("exports, require, module",
"\n\
/**\n\
 * dependencies.\n\
 */\n\
\n\
var each = require(\"component-each\")\n\
  , unserialize = require(\"yields-unserialize\")\n\
  , storage = window.localStorage\n\
  , type = require(\"component-type\");\n\
\n\
/**\n\
 * Store the given `key` `val`.\n\
 *\n\
 * @param {String} key\n\
 * @param {Mixed} val\n\
 * @return {Mixed}\n\
 */\n\
\n\
exports = module.exports = function(key, val){\n\
  switch (arguments.length) {\n\
    case 2: return set(key, val);\n\
    case 0: return all();\n\
    case 1: return 'object' == type(key)\n\
      ? each(key, set)\n\
      : get(key);\n\
  }\n\
};\n\
\n\
/**\n\
 * supported flag.\n\
 */\n\
\n\
exports.supported = !! storage;\n\
\n\
/**\n\
 * export methods.\n\
 */\n\
\n\
exports.set = set;\n\
exports.get = get;\n\
exports.all = all;\n\
\n\
/**\n\
 * Set `key` to `val`.\n\
 *\n\
 * @param {String} key\n\
 * @param {Mixed} val\n\
 */\n\
\n\
function set(key, val){\n\
  return null == val\n\
    ? storage.removeItem(key)\n\
    : storage.setItem(key, JSON.stringify(val));\n\
}\n\
\n\
/**\n\
 * Get `key`.\n\
 *\n\
 * @param {String} key\n\
 * @return {Mixed}\n\
 */\n\
\n\
function get(key){\n\
  return null == key\n\
    ? storage.clear()\n\
    : unserialize(storage.getItem(key));\n\
}\n\
\n\
/**\n\
 * Get all.\n\
 *\n\
 * @return {Object}\n\
 */\n\
\n\
function all(){\n\
  var len = storage.length\n\
    , ret = {}\n\
    , key\n\
    , val;\n\
\n\
  for (var i = 0; i < len; ++i) {\n\
    key = storage.key(i);\n\
    ret[key] = get(key);\n\
  }\n\
\n\
  return ret;\n\
}\n\
//@ sourceURL=yields-store/index.js"
));
require.register("metalsmith.io/index.js", Function("exports, require, module",
"\n\
var Carousel = require(\"stagas-infinite-carousel\");\n\
var Highlight = require(\"segmentio-highlight\");\n\
var js = require(\"segmentio-highlight-javascript\");\n\
\n\
/**\n\
 * Highlight.\n\
 */\n\
\n\
Highlight()\n\
  .use(js)\n\
  .all();//@ sourceURL=metalsmith.io/index.js"
));















































