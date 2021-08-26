const payment = (app) => {
  return (req, res, next) => {
    setTimeout(function () {
      res.sendStatus(200);
    }, 3000)
  };
};

module.exports = payment;
