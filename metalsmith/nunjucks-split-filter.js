export default function split(value, separator) {
  return String.prototype.split.call(value, separator);
}
