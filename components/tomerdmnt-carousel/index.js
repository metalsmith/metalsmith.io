var classes = require('classes');

module.exports = Carousel;

function isCarouselItem(elem) {
  return elem && elem.nodeName === 'DIV';
}

function nextSibling(item) {
  do {
    item = item.nextSibling;
  } while (item && !isCarouselItem(item));

  return item;
}

function prevSibling(item) {
  do {
    item = item.previousSibling;
  } while (item && !isCarouselItem(item))

  return item;
}

function Carousel(el, opts) {
  if (!(this instanceof Carousel)) return new Carousel(el, opts);
  opts = opts || {};
  this.el = el;
  classes(el).add('carousel');

  this._show(this.el.querySelector('.carousel > div'));
}

Carousel.prototype.forEach = function (cb) {
  var item = this.el.querySelector('div');
  while (item) {
    cb(item);
    item = nextSibling(item);
  }
}

Carousel.prototype.next = function () {
  var current = this.el.querySelector('.carousel-visible');
  var next = nextSibling(current);
  this._show(next);

  return next;
}

Carousel.prototype.prev = function () {
  var current = this.el.querySelector('.carousel-visible');
  var prev = prevSibling(current);
  this._show(prev);

  return prev;
}

Carousel.prototype._show = function (item) {
  if (!item) return;
  var next = nextSibling(item);
  var prev = prevSibling(item);

  this.forEach(function (ci) {
    classes(ci)
      .remove('carousel-next')
      .remove('carousel-prev')
      .remove('carousel-visible');
  });

  if (next) classes(next).add('carousel-next');
  if (prev) classes(prev).add('carousel-prev');
  classes(item).add('carousel-visible');
}

