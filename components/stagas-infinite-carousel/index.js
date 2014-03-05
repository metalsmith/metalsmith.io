
/**
 * infinite-carousel
 *
 * fork of: tomerdmnt/carousel
 *
 * licence MIT
 */

var classes = require('classes');

module.exports = Carousel;

function isCarouselItem(elem) {
  return elem && elem.nodeName === 'LI';
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

  var first = this.first()
  this.rearrange(first);
  this.show(first);
}

Carousel.prototype.list = function () {
  return this.el.querySelector('ul');
}

Carousel.prototype.first = function () {
  return this.el.querySelector('li');
}

Carousel.prototype.last = function () {
  var arr = this.el.querySelectorAll('li');
  return arr[arr.length-1];
}

Carousel.prototype.active = function () {
  return this.el.querySelector('li.carousel-active');
}

Carousel.prototype.forEach = function (cb) {
  var item = this.first()
  while (item) {
    cb(item);
    item = nextSibling(item);
  }
}

Carousel.prototype.next = function () {
  var current = this.active();
  var next = nextSibling(current);

  this.show(next);

  return next;
}

Carousel.prototype.prev = function () {
  var current = this.active();
  var prev = prevSibling(current);

  this.show(prev);

  return prev;
}

Carousel.prototype.getSiblings = function (item) {
  var next = nextSibling(item);
  var prev = prevSibling(item);
  if (!next) {
    next = this.first();
  }
  if (!prev) {
    prev = this.last();
  }
  return { next: next, prev: prev };  
}

Carousel.prototype.rearrange = function (item) {
  if (!nextSibling(item)) {
    this.list().insertBefore(item, this.first());
    this.list().insertBefore(this.last(), this.first());
  }
  if (!prevSibling(item)) {
    this.list().appendChild(item);
    this.list().appendChild(this.first());
  }
}

Carousel.prototype.show = function (item) {
  if (!item) return;

  var sib = this.getSiblings(item);

  this.forEach(function (ci) {
    classes(ci)
      .remove('carousel-next')
      .remove('carousel-prev')
      .remove('carousel-active');
  });

  classes(sib.next).add('carousel-next');
  classes(sib.prev).add('carousel-prev');
  classes(item).add('carousel-active');

  setTimeout(function (self) {
    self.rearrange(item)
  }, 600, this)
}
