import path from 'path';
const fs = require('fs');

export const getPrefixConfig = () => {

    const configFilePath = path.resolve() + '/buildconfig.json';

    if (!fs.existsSync(configFilePath)) {
        return {
            prefixpath: path.resolve(),
            prefixSalt: ''
        };
    }

    const configFile = fs.readFileSync(configFilePath, 'utf8');

    if(!configFile.length) {
        return new Error('please provide json in your buildconfig.json with a structure like: { "prefixpath": "public/typo3temp/", "namespace": "myNamespace" }');
    }

    try {

        const config = JSON.parse(configFile);

        if(!config.prefixSalt) {
            config.prefixSalt = '';
        }

        if(!config.prefixpath) {
            config.prefixpath = path.resolve();
        } else {
            config.prefixpath = `${path.resolve()}/${config.prefixpath}`;
        }

        return config;
    }
    catch(err) {
        return err;
    }

}
