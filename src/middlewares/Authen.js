const Authen = {
  LogToAdmin:async (request, response, next) => {
    if (request.sessions.role === "0"|| !request.sessions.role) {
      res.redirect("/error")
    } else {
      return true;
    }
  },
  isLoggin: (request, response, next) => {
    if (request.sessions) {
      return true;
    } else {
      return false;
    }
  },
};
module.exports = Authen;
