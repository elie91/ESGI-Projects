module.exports = (app) => {
  const Merchant = app.sequelize.models.Merchant;
  const Transaction = app.sequelize.models.Transaction;
  const TransactionStatusSequelize = app.sequelize.models.TransactionStatus;

  return {
    post,
    validCredentials,
    getAll,
    getMerchantTransactions,
    getById,
    put,
    generateKeys,
  };

  function post (req, res, user) {
    return Merchant.build({
      name: req.body.company_name,
      kbis: req.body.kbis,
      address: req.body.address,
      postal_code: req.body.postal_code,
      city: req.body.city,
      phone: req.body.phone,
      confirmation_url: req.body.confirmation_url,
      cancellation_url: req.body.cancellation_url,
      public_key: app.helpers.generateToken("public"),
      secret_key: app.helpers.generateToken("secret"),
      UserId: user.id,
      currency: req.body.currency,
    })
    .save()

  }

  function validCredentials (req, res) {
    if (req.merchant_id) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }

  function getAll (req, res) {
    let params = {
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
    };
    if (req.user.role !== "ADMIN") {
      params = {...params, where: { UserId: req.user.id } };
    }
    return Merchant.findAll(params)
      .then((data) => res.json(data))
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getById (req, res) {
    return Merchant.findByPk(req.params.id)
      .then((data) => (data ? res.json(data) : res.sendStatus(404)))
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function put (req, res) {
    return Merchant.update(req.body, { where: { id: req.params.id } })
      .then((data) => (data ? res.json(data) : res.sendStatus(404)))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
  }

  function getMerchantTransactions (req, res) {
    return Transaction.findAll({
      where: { MerchantId: req.params.id },
      include: [
        {
          model: TransactionStatusSequelize,
          as: "transactionStatus",
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [
          {
            model: TransactionStatusSequelize,
            as: "transactionStatus",
          }
          , "createdAt", "DESC",
        ],
      ],
    })
      .then((data) => (data ? res.json(data) : res.sendStatus(404)))
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

    async function generateKeys(req, res) {
        const merchant = await Merchant.findByPk(req.params.id);
        if (!merchant) res.sendStatus(500);
        merchant.public_key = app.helpers.generateToken("public")
        merchant.secret_key = app.helpers.generateToken("secret")
        await merchant.save();
        return res.json({public_key: merchant.public_key, secret_key: merchant.secret_key})
    }

};
