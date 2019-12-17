const fs = require('fs');
import path from 'path';

/**
 * Resolves a path to a valid scss file path
 *
 * @param {string} filePath to a scss file
 * @return {string} resolved scss file import path
 */
export const resolveSassImportPath = (filePath) => {

  let resolvedPath = filePath;

  if(path.extname(resolvedPath) !== '.scss') {
    resolvedPath = `${resolvedPath}.scss`;
  }

  if (fs.existsSync(resolvedPath)) {
    return resolvedPath;
  }

  resolvedPath = path.dirname(resolvedPath) + '/_' + path.basename(resolvedPath);

  if (fs.existsSync(resolvedPath)) {
    return resolvedPath;
  }

  return false;
}

/**
 * Resolves a path to a valid scss file path
 *
 * @param {string} componentPath the prefix for the scss content
 * @return {string} resolved file path
 */
export const resolveEnvironmentRelativeComponentPath = (componentPath) => {
  return `ext${componentPath.split('ext')[1]}`;
}

