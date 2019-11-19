import path from 'path';
import Map from 'es6-map';
import isGlob from 'is-glob';
import sort from 'sort-object';
import mapFiles from 'map-files';
import fluidComponentPrefixer from "../FluidComponentPrefixer/";
import PathResolver from "../PathResolver/";
require('regenerator-runtime/runtime');

export default function (base, url, done) {

  const aliases = new Map();

  if (aliases.has(base)) {
    return done(aliases.get(base));
  }

  let paths = [];

  if (isGlob(base)) {
    const files = sort(mapFiles(base));
    paths = Object.keys(files).map((key) => PathResolver(files[key].path));
  } else {
    paths.push(PathResolver(base))
  }

  fluidComponentPrefixer.getPrefixedContent(paths)
    .then((contentData) => {
      let prefixedContent = '';
      contentData.forEach((data, index) => {
        const dirName = path.dirname(paths[index]);
        prefixedContent += data.content
        if (data.prefix) {
          fluidComponentPrefixer.writePrefixJson(dirName, data.prefix)
            .then(console.log)
            .catch(data => ( console.log(data)  ));
        } else {
          fluidComponentPrefixer.removePrefixJson(dirName)
            .then(console.log)
            .catch(data => ( console.log(data)  ));
        }
      })
      aliases.set(base, { contents: prefixedContent});
      return done({ contents: prefixedContent });
    })
    .catch(data => ( console.log(data)  ));
}
