import path from 'path';
import Map from 'es6-map';
import isGlob from 'is-glob';
import sort from 'sort-object';
import mapFiles from 'map-files';
import FluidComponentPrefixer from "../FluidComponentPrefixer/";
import {resolveSassImportPath, resolveEnvironmentRelativeComponentPath} from "../PathHelper/";

export default function (base, done, config) {


  const aliases = new Map();

  if (aliases.has(base)) {
    return done(aliases.get(base));
  }

  let paths = [];
  const jsonData = [];
  if (isGlob(base)) {
    const files = sort(mapFiles(base));
    paths = Object.keys(files).map((key) => resolveSassImportPath(files[key].path));
  } else {
    paths.push(resolveSassImportPath(base))
  }

  FluidComponentPrefixer.getPrefixedContent(paths, config.prefixSalt)
  .then((contentData) => {
      let processedContent = '';

      contentData.forEach((data, index) => {
        processedContent += data.content
        if(data.prefix) {
          jsonData.push({
            componentPath: resolveEnvironmentRelativeComponentPath(path.dirname(paths[index])),
            prefix: data.prefix
          })
        }
      })

      if(jsonData.length) {
          // TODO REMOVE FROM JSON IF PREFIXING ON A FILE WAS REVERTED
          FluidComponentPrefixer.writePrefixJson(jsonData, config.prefixpath)
              .then(console.log)
              .catch(data => ( console.log(data)  ));
      }

      aliases.set(base, { contents: processedContent});
      return done({ contents: processedContent });
    })
    .catch(data => ( console.log(data)  ));
}
