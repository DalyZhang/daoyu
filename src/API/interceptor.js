import { baseUrl, version } from "./apis.config";

let Authorization = "";

function requestError(code, msg) {
  this.name = "RequestError";
  this.code = code;
  this.message = JSON.stringify(msg);
  this.stack = new Error().stack;
}
requestError.prototype = Object.create(Error.prototype);
requestError.prototype.constructor = requestError;

const handleParam = queryObj => {
  let queryString = "";
  for (let key in queryObj)
    if (queryObj[key] !== undefined) queryString += `&${key}=${queryObj[key]}`;
  if (queryString.length > 0) queryString = `?${queryString.slice(1)}`;
  return queryString;
};

const requestWrapper = (req, resolve, reject) => {
  const originReq = Object.assign({}, req);
  req.header = {
    Authorization: Authorization
  };
  uni.showLoading({
    title: "努力中...",
    mask: true
  });
  req.url = baseUrl + version + req.url + handleParam(req.params);

  req.success = res => {
    Authorization = (res.header && res.header["Authorization"]) || Authorization || "";
    if (res.data && typeof res.data === "string")
      try {
        res.data = JSON.parse(res.data);
      } catch (err) {}
    uni.hideLoading();
    if (parseInt(res.statusCode / 100) === 2) {
      resolve(res.data);
      return;
    }
    if (parseInt(res.statusCode / 100) === 4) {
      if (res.statusCode === 401)
        setTimeout(function() {
          request(originReq);
        }, 200);
      reject(new requestError(res.statusCode, res));
    }
  };

  req.fail = reject;

  req.dataType = req.dataType || "json";

  return req;
};

/**
 * @param {Object} req
 * @param {Object} [req.params] - a object that will sequelize to "&key=value"
 * @param {Object} [req.body]
 * @param {string} [req.dataType]
 * @param {string} req.url
 * @param {string} req.method
 */

const request = async req => {
  return new Promise(function(resolve, reject) {
    uni.request(requestWrapper(req, resolve, reject));
  }).catch(err => {
    uni.showToast({
      title: "请求失败"
    });
    let msg = JSON.parse(err.message);
    console.log(msg);
    throw err;
  });
};

/**
 * @param {Object} req
 * @param {string} req.url
 * @param {string} req.method
 * @param {string} req.filePath - can be a http or https whatmore tmp storage url
 * @param {Object} req.header
 * @param {Object} req.header.contentType - in fact it's should write as Content-Type
 * @param {string} req.name - backend can fetch resource by this key
 */

const uploadFile = req => {
  return new Promise(function(resolve, reject) {
    uni.uploadFile(requestWrapper(req, resolve, reject));
  }).catch(err => {
    uni.showToast({
      title: "请求失败"
    });
    let msg = JSON.parse(err.message);
    console.log(msg);
    throw err;
  });
};

const downloadFile = req => {
  uni.downloadFile(requestWrapper(req));
};

export default {
  request,
  uploadFile,
  downloadFile
};
