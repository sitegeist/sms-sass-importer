import stringHash from "string-hash";
import {parse, stringify} from 'sast';
const fs = require('fs');
import path from 'path';

export const addPrefix = (ast, prefix) => {
    if (ast.type === 'class' && ast.children && ast.children[0]) {
      ast.children[0].value = `${prefix}${ast.children[0].value}`;
    } else if (ast.children) {
      ast.children.forEach(child => addPrefix(child, prefix));
    }
  return ast;
};

export const buildPrefixedContent = (prefix, fileContent) => {
  const ast = parse(fileContent);
  const prefixedAst = addPrefix(ast, prefix);
  return stringify(prefixedAst);
}

const getPrefixedContent = (paths) => {
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
        const prefix = buildPrefix(path);
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

const writePrefixJson = (path, prefix) => {
  return new Promise((resolve, reject) => {

    const json = {
      prefix: prefix
    }
    const fileToWrite = `${path}/prefix.json`;
    const data = JSON.stringify(json);

    if (fs.existsSync(fileToWrite)) {
      return false;
    }

    fs.writeFile(fileToWrite, data, (err) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve(`saved ${fileToWrite}`);
    });

  });
}

const removePrefixJson = (path) => {
  return new Promise((resolve, reject) => {
    const fileToRemove = `${path}/prefix.json`;

    if (!fs.existsSync(fileToRemove)) {
      return false;
    }

    fs.unlink(fileToRemove, (err) => {
      if(err) {
        reject(new Error(err));
      }
      return resolve(`removed ${fileToRemove}`);
    })

  })
}

const buildPrefix = (filePath) =>  {
  const fileName = path.basename(filePath).split('.')[0];

  const projectNamespace = getProjectNamespace();
  const prefix = stringHash(projectNamespace + fileName)
    .toString(36)
    .substr(0, 5);
  return `${prefix}-`
}

const getProjectNamespace = () => {
  let projectName = process.argv.find(ns => ns.includes('prefix='));
  if(projectName) {
    return projectName.split('=')[1];
  }
  return '';
}

const fluidComponentPrefixer = {
  addPrefix,
  buildPrefixedContent,
  getPrefixedContent,
  writePrefixJson,
  removePrefixJson,
  buildPrefix,
  getProjectNamespace
}

export default fluidComponentPrefixer;
