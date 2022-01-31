module.exports = function formatDate(value, format) {
  const dt = new Date(value);
  if (format === 'iso') {
    return dt.toISOString();
  }
  const utc = dt.toUTCString().match(/(\d{1,2}) (.*) (\d{4})/);
  return `${utc[2]} ${utc[1]}, ${utc[3]}`;
}