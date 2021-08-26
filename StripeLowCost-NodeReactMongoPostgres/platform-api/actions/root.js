module.exports = app => {

  return {
    test
  };

    /**
     * [Api root]
     * @param  {object}   req  Expresss request
     * @param  {object}   res  Expresss response
     * @param  {Function} next Next middleware
     * @return {Promise}       returned Promise
     */
    function test (req, res, next) {
      res.json({success: true})
    }

};
