let obj = {};

const get = key => {
  const target = obj[key];
  // obj[key] = undefined;
  return target;
};

const set = (key, value) => {
  obj[key] = value;
};

export default {
  get,
  set
};
