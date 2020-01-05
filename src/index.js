import {prefixImporter} from './Modules/PrefixImporter';
import {jsonImporter, isJSONfile} from './Modules/JsonImporter';
import {getPrefixConfig} from './Util/PrefixConfig';
import {ImportPathResolver} from './Util/ImportPathResolver';

import 'json5/lib/register';

const importPathResolver = new ImportPathResolver();

const importIterationCounter = [];

export default () => {

  return function(url, prev, done) {

    if (isJSONfile(url)) {
        return jsonImporter(url, prev)
    }

    const config = getPrefixConfig();

    importIterationCounter.push(1);
    importPathResolver.initialPreviousResolvedPath = prev;
    importPathResolver.importFilePath = url;
    const filePath = importPathResolver.resolvedFilePath;
    return prefixImporter(filePath, done, config, importIterationCounter.length);
  }
}

// Super-hacky: Override Babel's transpiled export to provide both
// a default CommonJS export and named exports.
// Fixes: https://github.com/Updater/node-sass-json-importer/issues/32
// TODO: Remove in 3.0.0. Upgrade to Babel6.
module.exports = exports.default;
Object.keys(exports).forEach(key => module.exports[key] = exports[key]);
