export function paramsToQuery(params, cache = false) {
  let rtn = '', keyNum = 0;
  const keys = Object.keys(params);
  for ( const key of keys) {
    if (rtn) {
      rtn += '&';
    }
    rtn += `${key}=${params[key]}`;
    keyNum++;
  }
  if (!cache) {
    if (keyNum > 0) {
      rtn += '&';
    }
    rtn += `_=${Date.now()}`;
  }
  return `?${rtn}`;
}
