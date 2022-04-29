//user.js
export default [
    {
      url: "/api/getUsers",
      method: "get",
      response: () => {
        return {
          code: 0,
          msg: "ok",
          data: ["tom", "jerry"],
        };
      },
    },
  ];
  