module.exports = app => {
  const Currency = app.sequelize.models.Currency;
  const Scrapper = require("./../lib/Scrapper");

  return {
    cget,
  };

  function cget (req, res) {
    return Currency.findAll({
      attributes: [[app.sequelize.fn('DISTINCT', app.sequelize.col('origin')), 'currency']]
    })
      .then(data => {
        if (data.length > 0){
          res.json(data);
        }else{
          fetchCurrencies(req, res);
          cget(req, res);
        }
      }).catch(err => console.error(err))
  }

  function saveResult (data) {
    Promise.all(data.map(datum => {
      Currency.findOne({where: {origin: datum.origin, destination: datum.destination} })
        .then(data => {
          if (data){
            Currency.update({ amount: datum.amount }, {where: {id: data.id}})
          }else{
            Currency.build(datum).save()
          }
        })
    })).then(() => {
      console.log("Currencies loaded");
    });
  }

  function fetchCurrencies (req, res) {
    let request = Scrapper("https://www.boursorama.com/bourse/devises/taux-de-change/", {}, app.helpers.processData, saveResult);
    request.end();
    return res.sendStatus(res.statusCode);
  }
};
