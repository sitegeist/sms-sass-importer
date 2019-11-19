export function isJSONfile(url) {
  return /\.json5?$/.test(url);
}

export function hasWildCards(url) {
  return url.includes('/*')
}


