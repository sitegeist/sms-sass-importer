const fs = require('fs');

/**
 * Writes a json file and returns a promise
 *
 * @param {array} prefixData the data for writing the prefix information
 * @param {string} prefixJsonPath to a folder to write the json file in
 * @return {Promise}
 */
export const writePrefixJson = (prefixData, prefixJsonPath) => {

    return new Promise((resolve, reject) => {

        let jsonResults = [],
            resolveMessage = '';

        if (fs.existsSync(prefixJsonPath) && validateJsonFile(fs.readFileSync(prefixJsonPath, 'utf8'))) {
            const prefixJsonFile = fs.readFileSync(prefixJsonPath, 'utf8');
            const prefixJsonData = JSON.parse(prefixJsonFile);
            const concatArray = prefixData.concat(prefixJsonData);
            jsonResults = JSON.stringify(concatArray.filter((v,i,a)=>a.findIndex(t=>(t.prefix === v.prefix))===i));
        } else {
            jsonResults = JSON.stringify(prefixData);
            resolveMessage = `created ${prefixJsonPath}`;
        }

        fs.writeFile(prefixJsonPath, jsonResults, (err) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(resolveMessage);
        });
    });
}

const validateJsonFile = (body) => {
    try {
        JSON.parse(body);
        return true;
    } catch(e) {
        return null;
    }
}
