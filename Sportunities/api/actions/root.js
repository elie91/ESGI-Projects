module.exports = (app) => {

  return {
    version
  }

  function version(req, res, next) {
    return res.json({version: require("../package.json").version})
  }
};
