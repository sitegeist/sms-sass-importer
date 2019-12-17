import path from 'path';
const fs = require('fs');

export function isJSONfile(url) {
  return /\.json5?$/.test(url);
}

export function hasWildCards(url) {
  return url.includes('/*')
}

export function getPrefixConfig() {

  const configFilePath = path.resolve() + '/buildconfig.json';

  return new Promise((resolve, reject) => {

    if (!fs.existsSync(configFilePath)) {
      reject(new Error('please provide buildconfig.json in the same dir as your package.json lies in, with a structure like: { "prefixpath": "public/typo3temp/", "namespace": "myNamespace" }'))
    }

    const configFile = fs.readFileSync(configFilePath, 'utf8');

    if(!configFile.length) {
      reject(new Error('please provide json in your buildconfig.json with a structure like: { "prefixpath": "public/typo3temp/", "namespace": "myNamespace" }'))
    }

    try {

      const jsonConfig = JSON.parse(configFile);

      if(!jsonConfig.prefixSalt) {
        jsonConfig.prefixSalt = '';
      }

      resolve(jsonConfig);
    }
    catch(err) {
      reject(err)
    }

  })


}

