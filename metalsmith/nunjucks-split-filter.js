module.exports = function split(value, separator) {
  return String.prototype.split.call(value, separator);
};
