const fs = require('fs');
import path from 'path';
import Map from 'es6-map';
import isGlob from 'is-glob';
import sort from 'sort-object';
import mapFiles from 'map-files';
import Prefixer from "../Prefixer/";
import {writePrefixJson} from "../../Util/WritePrefixJson";
import {resolveSassImportPath, resolveEnvironmentRelativeComponentPath} from "../../Util/PathHelper";

export function prefixImporter (base, done, config, importIterationCounter) {

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

    const prefixJsonPath = `${config.prefixpath}/prefix.json`;

    // on first import remove json file with prefix data
    if (fs.existsSync(prefixJsonPath) && importIterationCounter === 1) {
        console.log(importIterationCounter);
        fs.unlinkSync(prefixJsonPath)
    }

    Prefixer.getPrefixedContent(paths, config.prefixSalt)
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
          writePrefixJson(jsonData, prefixJsonPath)
              .then(console.log)
              .catch(data => ( console.log(data)  ));
      }

      aliases.set(base, { contents: processedContent});
      return done({ contents: processedContent });
    })
    .catch(data => ( console.log(data)  ));
}
