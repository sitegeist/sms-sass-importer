import path from 'path';
import {isJSONfile} from './Helper';
import Importer from './Modules/Importer';
import JsonImporter from './Modules/JsonImporter';

import 'json5/lib/register'; // Enable JSON5 support

export default () => {
  return function(url, prev, done) {
    if (isJSONfile(url)) {
        return JsonImporter(url, prev, this.options)
    }

    let filePath = path.join(path.dirname(prev), url);

    return Importer(filePath, url, done)
  }
}




// Super-hacky: Override Babel's transpiled export to provide both
// a default CommonJS export and named exports.
// Fixes: https://github.com/Updater/node-sass-json-importer/issues/32
// TODO: Remove in 3.0.0. Upgrade to Babel6.
module.exports = exports.default;
Object.keys(exports).forEach(key => module.exports[key] = exports[key]);
