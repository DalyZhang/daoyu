import middleRequest from "./interceptor";

export default {
  authenticate: {
    login: ({ code }) =>
      middleRequest.request({
        url: "/login",
        method: "POST",
        data: {
          code
        }
      })
  }
};
