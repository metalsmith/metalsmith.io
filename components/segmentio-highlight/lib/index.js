
var escape = require('escape-html');

/**
 * Expose `Highlight`.
 */

module.exports = Highlight;

/**
 * Initialize a new `Highlight` instance.
 */

function Highlight(){
  if (!(this instanceof Highlight)) return new Highlight();
  this.languages = {};
  this.prefix('Highlight-');
}

/**
 * Use a `plugin` function.
 *
 * @param {Function} plugin
 * @return {Highlight}
 */

Highlight.prototype.use = function(plugin){
  plugin(this);
  return this;
};

/**
 * Get or set the highlighted class `prefix`.
 *
 * @param {String} prefix
 * @return {Highlight or String}
 */

Highlight.prototype.prefix = function(prefix){
  if (!arguments.length) return this._prefix;
  this._prefix = prefix;
  return this;
}

/**
 * Define a new `language` with a `grammar`.
 *
 * @param {String} language
 * @param {Object} grammar
 * @return {Highlight}
 */

Highlight.prototype.language = function(language, grammar){
  this.languages[language] = grammar;
  return this;
};

/**
 * Highlight an HTML `string` of a given `language`.
 *
 * @param {String} string
 * @param {String} language
 * @return {String}
 */

Highlight.prototype.string = function(string, language){
  var ast = this.parse(string, language);
  var str = this.stringify(ast);
  return str;
};

/**
 * Highlight an `el`, with optional `language`.
 *
 * @param {Element or String} el
 * @param {String} language (optional)
 */

Highlight.prototype.element = function(el, language){
  if ('string' == typeof el) el = document.querySelector(el);
  var str = this.string(el.textContent, language || lang(el));
  el.innerHTML = str;
};

/**
 * Highlight an array of `els`, with optional `language`.
 *
 * @param {Array or String} els
 * @param {String} language (optional)
 */

Highlight.prototype.elements = function(els, language){
  if ('string' == typeof els) els = document.querySelectorAll(els);
  for (var i = 0, el; el = els[i]; i++) this.element(el, language);
};

/**
 * Highlight all elements in the DOM with language attributes.
 */

Highlight.prototype.all = function(){
  this.elements(document.querySelectorAll('[data-language]'));
  this.elements(document.querySelectorAll('[class*="language-"]'));
  this.elements(document.querySelectorAll('[class*="lang-"]'));
};

/**
 * Parse a `string` with a given language's `grammar`, returning an AST.
 *
 * @param {String} string
 * @param {String or Object} grammar
 * @return {Array}
 */

Highlight.prototype.parse = function(string, grammar){
  if ('string' == typeof grammar) {
    var lang = grammar;
    grammar = this.languages[lang];
    if (!grammar) throw new Error('unknown language "' + lang + '"');
  }

  if (!grammar) throw new Error('must provide a grammar');
  if (!string) return [];
  var ret = [string];

  for (var key in grammar) {
    var rule = grammar[key];
    var regexp = rule.pattern || rule;

    for (var i = 0; i < ret.length; i++) {
      var str = ret[i];
      if ('object' == typeof str) continue;
      var m = regexp.exec(str);
      if (!m) continue;

      var contents = m[0];
      var before = str.slice(0, m.index);
      var after = str.slice(m.index + contents.length);
      var args = [i, 1];
      var token = {
        type: key,
        value: rule.children ? this.parse(contents, rule.children) : contents
      };

      if (before) args.push(before);
      args.push(token);
      if (after) args.push(after);
      ret.splice.apply(ret, args);
    }
  }

  return ret;
}

/**
 * Stringify a given `ast`.
 *
 * @param {Array} ast
 * @return {String}
 */

Highlight.prototype.stringify = function(ast){
  var prefix = this.prefix();
  var self = this;

  return ast.map(function(t){
    if ('string' == typeof t) return escape(t);
    var type = t.type;
    var value = 'object' == typeof t.value
      ? self.stringify(t.value)
      : escape(t.value);
    return '<span class="' + prefix + type + '">' + value + '</span>';
  }).join('');
};

/**
 * Language class matcher.
 */

var matcher = /\blang(?:uage)?-(\w+)\b/i;

/**
 * Get the code language for a given `el`. First look for a `data-language`
 * attribute, then a `language-*` class, then search up the DOM tree for them.
 *
 * @param {Element} el
 * @return {String}
 */

function lang(el){
  if (!el) return;
  var m;
  if (el.hasAttribute('data-language')) return el.getAttribute('data-language');
  if (m = matcher.exec(el.className)) return m[1];
  return language(el.parentNode);
}