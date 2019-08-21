// Here defines how many items will be load per page.
const PER_PAGE = 10;
export default api => {
  let page = 0;
  let limit = PER_PAGE;
  let hasNext = true;
  let list = [];

  // item means that array
  const insertItem = (index, item) => {
    if (list.length >= index) {
      list.splice(index, 0, ...item);
      return list;
    } else {
      throw "Out of boundary.";
    }
  };

  const modifyItem = (index, fn) => {
    const newItem = fn(list[index]);
    list[index] = newItem;
    return list;
  };

  const removeItem = (index, count = 1) => {
    if (list.length > index) {
      list.splice(index, count);
      return list;
    } else {
      throw "Out of boundary.";
    }
  };

  // the next page handle.
  const nextPage = async params => {
    if (hasNext) {
      //describe the information will get
      let obj = {};
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          obj[key] = params[key];
        }
      }
      if (obj.limit === undefined) obj.limit = limit;
      if (obj.offset === undefined) obj.offset = 0;
      obj.offset = page * obj.offset;
      if (page !== 0) {
        uni.showLoading({
          title: "正在加载下一页"
        });
      }
      let data = await api(obj);
      uni.hideLoading();
      list.push(...data);
      if (data.length < obj.limit) hasNext = false;
      page++;
      return new Promise(function(resolve, reject) {
        resolve(list);
      });
    } else {
      return new Promise(function(resolve, reject) {
        resolve(list);
      });
    }
  };

  const reset = () => {
    page = 0;
    hasNext = true;
    list = [];
  };

  return {
    reset,
    nextPage,
    insertItem,
    removeItem,
    modifyItem
  };
};
