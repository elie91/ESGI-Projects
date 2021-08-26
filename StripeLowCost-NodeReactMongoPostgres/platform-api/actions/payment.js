const http = require("http");

module.exports = (app) => {
  const Transaction = app.sequelize.models.Transaction;
  const TransactionStatus = app.sequelize.models.TransactionStatus;
  const Merchant = app.sequelize.models.Merchant;

  return {
    render,
    check,
  };

  function render (req, res) {
    return Transaction.findByPk(req.params.id)
      .then(transaction => {
        TransactionStatus.findAll({ where: { TransactionId: transaction.id }, order: [["createdAt", "DESC"]] })
          .then((status) => {
            if (status[0].name === app.config.constants.CREATED) {
              res.render("payment.html.twig", {
                url: app.config.apiurl + ":" + app.config.port + "/payment/" + transaction.id + "/check",
                transaction: {
                  id: transaction.id,
                  lastname: transaction.client_lastname,
                  firstname: transaction.client_firstname,
                  address: transaction.billing_address + ", " + transaction.billing_postal_code + " " + transaction.billing_city,
                  amount: transaction.amount,
                  products: transaction.products,
                },
              });
            } else {
              res.render("error.html.twig");
            }

          });
      })
      .catch(() => res.render("error.html.twig"));
  }

  function check (req, res) {
    let request = http.request({ host: "psp-api", port: 3000, method: "GET" }, (response) => {
      TransactionStatus.findAll({ where: { TransactionId: req.params.id }, order: [["createdAt", "DESC"]] })
        .then((status) => {
          if (status[0].name === app.config.constants.CREATED) {
            Transaction.findByPk(req.params.id).then((transaction) => {
              Merchant.findByPk(transaction.MerchantId).then((merchant) => {
                let name;
                if (validCard(req.body).length === 0) {
                  TransactionStatus.build({
                    name: app.config.constants.PROCESSING,
                    TransactionId: req.params.id,
                  }).save()
                    .catch((error) => console.error(error) || res.sendStatus(500));
                  if (response.statusCode === 200) {
                    name = app.config.constants.PAID;
                    Transaction.update({
                      payment_method: {
                        fullname: req.body.name,
                        card: "**** **** **** " + req.body.card.replace(" ", "").substr(12, 16),
                        date: req.body.date,
                        cvc: req.body.cvc,
                        type: req.body.type,
                      },
                    }, { where: { id: req.params.id } })
                      .catch(() => res.sendStatus(500));
                  } else {
                    name = app.config.constants.FAIL;
                  }
                  TransactionStatus.build({
                    name: name,
                    TransactionId: req.params.id,
                  }).save()
                    .then(() => res.status(response.statusCode).json({
                      confirmation_url: merchant.confirmation_url,
                      cancellation_url: merchant.cancellation_url,
                    }))
                    .catch(() => res.sendStatus(500))
                  ;
                } else {
                  res.status(400).json({ errors: validCard(req.body) });
                }
              });
            }).catch((err) => console.error(err) || res.sendStatus(500));
          } else {
            res.status(404).json({ errors: [{ message: "Transaction terminée" }] });
          }
        });
    });
    request.end();
  }

  function validCard (params) {
    let errors = [];

    if (Object.keys(params).length !== 5) {
      errors.push({ message: "Vous devez saisir tous les champs" });
    }
    if (params.name && params.name.length < 2) {
      errors.push({ field: "name", message: "Le nom doit faire plus de 2 caractères" });
    }
    if (params.card) {
      let card = params.card.replace(/\s/g, "");
      if (card.length < 15 || card.length > 16) {
        errors.push({ field: "card", message: "Le numéro de votre cart doit faire 16 chiffres" });
      }
    }
    if (params.date) {
      let date = params.date.split("/");
      const today = new Date();
      date = new Date(today.getFullYear().toString().substr(0, 2) + date[1] + "-" + date[0]);
      if (date < today) {
        errors.push({ field: "date", message: "Votre carte a expiré" });
      }
    }
    if (params.cvc && (params.cvc.length < 3 || params.cvc.length > 4)) {
      errors.push({ field: "cvc", message: "Votre code de vérification est invalide" });
    }

    return errors;
  }
};
