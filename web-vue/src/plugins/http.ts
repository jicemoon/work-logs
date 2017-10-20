import Axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';

import { URL_ROOT } from '../models/requestParams.model';

function ajaxPreFilter(res: AxiosResponse) {
  return res.data;
}
function ajaxPreErrorFilter(err: AxiosError) {
  throw err;
}
function initMethods(instance: any) {
  const https: any = { };
  ['delete', 'get', 'head', 'options', 'post', 'put', 'patch'].forEach(method => {
    https[method] = function () {
      return instance[method].apply(instance, arguments)
        .then(ajaxPreFilter)
        .catch(ajaxPreErrorFilter);
    };
  });
  return https;
}
function createAxiosInstance() {
  return Axios.create({
    baseURL: URL_ROOT,
    timeout: 20000,
    withCredentials: true,
    params: { _: null },
    paramsSerializer: function (params) {
      let s = [];
      if (params._ === null) {
        s = ['_=' + Date.now()];
      } else {
        s = ['_=' + params._];
      }
      for (const key of Object.keys(params)) {
        if (key !== '_') {
          s.unshift(key + '=' + encodeURI(params[key]));
        }
      }
      return s.join('&');
    }
  });
}
const http = {
  install(vue: any) {
    const instance = createAxiosInstance();
    vue.prototype.$http = initMethods(instance);
  }
};
export {http as HttpService};
