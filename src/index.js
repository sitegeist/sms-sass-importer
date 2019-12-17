import {isJSONfile} from './Helper';
import PrefixImporter from './Modules/PrefixImporter';
import JsonImporter from './Modules/JsonImporter';
import {getPrefixConfig} from './Helper';

import {ImportPathResolver} from './Helper/ImportPathResolver';

import 'json5/lib/register';

const importPathResolver = new ImportPathResolver();

export default () => {

  return function(url, prev, done) {

    if (isJSONfile(url)) {
        return JsonImporter(url, prev)
    }

    getPrefixConfig()
        .then((config) => {
            importPathResolver.initialPreviousResolvedPath = prev;
            importPathResolver.importFilePath = url;
            const filePath = importPathResolver.resolvedFilePath;
            return PrefixImporter(filePath, done, config)
        })
        .catch(data => ( console.log(data)  ));
  }
}

// Super-hacky: Override Babel's transpiled export to provide both
// a default CommonJS export and named exports.
// Fixes: https://github.com/Updater/node-sass-json-importer/issues/32
// TODO: Remove in 3.0.0. Upgrade to Babel6.
module.exports = exports.default;
Object.keys(exports).forEach(key => module.exports[key] = exports[key]);
