import {parse, stringify} from 'sast';
const fs = require('fs');
const crypto = require('crypto');
import {resolveEnvironmentRelativeComponentPath} from "../../Util/PathHelper";
/**
 * sets the prefix in every class selector
 * returns a manipulated abstract syntax tree (ast)
 *
 * @param {Object} ast an abstract syntax tree
 * @param {string} prefix the prefix for the scss content
 * @return {Object}
 */
export const addPrefix = (ast, prefix) => {
    if (ast.type === 'class' && ast.children && ast.children[0]) {
      if(ast.children.length > 1) {
        let fixedValueWithInterpolation = `${prefix}${ast.children[0].value}`;
        ast.children.forEach((child, index) => {
          if(index > 0) {
            switch (child.type) {
              case "interpolation":
                fixedValueWithInterpolation += `#{$${child.children[0].children[0].value}}`;
                break;
              case "ident":
                fixedValueWithInterpolation += child.value;
                break;
            }
            ast.children[index] = {};
          }
        });
        ast.children[0].value = fixedValueWithInterpolation;
      } else {
        ast.children[0].value = `${prefix}${ast.children[0].value}`;
      }
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
 * Generated a prefix out of the filename, and an optional projectNameSpace
 *
 * @param {string} filePath to a folder to remove the json file from
 * @param {string} prefixSalt salt to make the component prefix unique ( can be set in the buildconfig.json file of the project )
 * @return {String} the prefix
 */
const buildPrefix = (filePath, prefixSalt) =>  {
  
  let prefix = crypto.createHash('md5').update(prefixSalt + resolveEnvironmentRelativeComponentPath(filePath)).digest('hex');
  var firstLetter = prefix.match(/\D/).index;
  prefix = prefix.substr(firstLetter, 5);

  return `${prefix}-`
}


const Prefixer = {
  addPrefix,
  buildPrefixedContent,
  getPrefixedContent,
  buildPrefix
}

export default Prefixer;
