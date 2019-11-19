const fs = require('fs');
import path from 'path';

export default (filePath) => {

  let resolvedPath = filePath;

  if(!path.isAbsolute(filePath)) {
    const basePath = path.resolve();
    resolvedPath = basePath + '/' + filePath.split('/').filter(p => p !== '..').join('/');
  }

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

