import stringHash from "string-hash";
import {parse, stringify} from 'sast';
const fs = require('fs');
import path from 'path';
import {resolveEnvironmentRelativeComponentPath} from "../PathHelper/";
/**
 * sets the prefix in every class selector
 * returns a manipulated abstract syntax tree (ast)
 *
 * @param {Object} ast an abstract syntax tree
 * @param {string} prefix the prefix for the scss content
 * @return {String}
 */
export const addPrefix = (ast, prefix) => {
    if (ast.type === 'class' && ast.children && ast.children[0]) {
      ast.children[0].value = `${prefix}${ast.children[0].value}`;
    } else if (ast.children) {
      ast.children.forEach(child => addPrefix(child, prefix));
    }
  return ast;
};

/**
 * Returns a prefixed scss content
 *
 * @param {string} prefix the prefix for the scss content
 * @param {string} fileContent the unprefixed scss content
 * @return {String}
 */
export const buildPrefixedContent = (prefix, fileContent) => {
  const ast = parse(fileContent);
  const prefixedAst = addPrefix(ast, prefix);
  return stringify(prefixedAst);
}


/**
 * Returns a promise with an array of scss file contents
 *
 * @param {array} paths an array of paths
 * @return {Promise} Promise object represents an array of prefixed contents
 */
const getPrefixedContent = (paths, prefixSalt) => {
  return new Promise((resolve, reject) => {

    if(!paths.length) {
      return reject(new Error('no valid path provided to importer'));
    }

    const content = [];

    paths.forEach(path => {

      if(!path) {
        return false;
      }

      const scss = fs.readFileSync(path, 'utf8');

      if (scss.includes('@use-prefix')) {
        const prefix = buildPrefix(path, prefixSalt);
        content.push({
          content: buildPrefixedContent(prefix, scss),
          prefix
        })
      } else {
        content.push({
          content: scss,
          prefix: false
        })
      }

    })

    return resolve(content);

  })
};

/**
 * Writes a json file and returns a promise
 *
 * @param {array} jsonData to a folder to write the json file in
 * @param {string} prefixpath to a folder to write the json file in
 * @return {Promise}
 */
const writePrefixJson = (jsonData, prefixpath) => {
  return new Promise((resolve, reject) => {

    const prefixJsonPath = `${path.resolve()}/../../${prefixpath}prefix.json`;

    let jsonResults = [],
        resolveMessage = '';

    if (fs.existsSync(prefixJsonPath) && validateJsonFile(fs.readFileSync(prefixJsonPath, 'utf8'))) {
        const prefixJson = fs.readFileSync(prefixJsonPath, 'utf8');
        const prefixData = JSON.parse(prefixJson);
        const concatArray = jsonData.concat(prefixData);
        resolveMessage = `updadet ${prefixJsonPath}`;
        jsonResults = JSON.stringify(concatArray.filter((v,i,a)=>a.findIndex(t=>(t.prefix === v.prefix))===i));
    } else {
      jsonResults = JSON.stringify(jsonData);
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

/**
 * Generated a prefix out of the filename, and an optional projectNameSpace
 *
 * @param {string} filePath to a folder to remove the json file from
 * @param {string} prefixSalt salt to make the component prefix unique ( can be set in the buildconfig.json file of the project )
 * @return {String} the prefix
 */
const buildPrefix = (filePath, prefixSalt) =>  {


    console.log(filePath);

  const fileName = resolveEnvironmentRelativeComponentPath(filePath)

  const prefix = stringHash(prefixSalt + fileName)
    .toString(36)
    .substr(0, 5);

  return `${prefix}-`
}


const FluidComponentPrefixer = {
  addPrefix,
  buildPrefixedContent,
  getPrefixedContent,
  writePrefixJson,
  buildPrefix
}

export default FluidComponentPrefixer;
