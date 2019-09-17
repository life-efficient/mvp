
export function importAll(directory) {
  var r = require.context(directory, false)
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
