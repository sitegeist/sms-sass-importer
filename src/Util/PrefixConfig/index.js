import path from 'path';
const fs = require('fs');

export const getPrefixConfig = () => {

    const configFilePath = path.resolve() + '/buildconfig.json';

    return new Promise((resolve, reject) => {

        if (!fs.existsSync(configFilePath)) {
            resolve({
                prefixpath: path.resolve(),
                prefixSalt: ''
            });
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

            if(!jsonConfig.prefixpath) {
                jsonConfig.prefixpath = path.resolve();
            } else {
                jsonConfig.prefixpath = `${path.resolve()}/${jsonConfig.prefixpath}`;
            }

            resolve(jsonConfig);
        }
        catch(err) {
            reject(err)
        }

    })


}