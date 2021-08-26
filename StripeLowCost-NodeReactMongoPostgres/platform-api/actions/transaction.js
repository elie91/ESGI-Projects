module.exports = (app) => {
    const TransactionSequelize = app.sequelize.models.Transaction;
    const TransactionStatusSequelize = app.sequelize.models.TransactionStatus;
    const TransactionMongoose = app.mongoose.models.Transaction;

    return {
        cget,
        post,
        get,
        put,
        remove,
        refund,
        search,
        groupByDate,
        amountByDate
    };

    /*********** SEQUELIZE  *****************/
    function cget(req, res) {
        let objectParam = {
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
        };
        if(req.merchant_id) {
            objectParam = {...objectParam, where: {MerchantId: req.merchant_id}};
        }
        if (req.user && req.user.role === "MERCHANT") {
            objectParam = {...objectParam, where: {MerchantId: req.user.merchant_id}};
        }
        return TransactionSequelize.findAll(objectParam)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => console.log(err) || res.sendStatus(500));
    }

    function post(req, res) {
        if (req.merchant_id) {
            if (Object.keys(checkUserInformations(req.body)).length === 0) {
                return TransactionSequelize.build({
                    client_firstname: req.body.client_firstname,
                    client_lastname: req.body.client_lastname,
                    billing_address: req.body.billing_address,
                    billing_postal_code: req.body.billing_postal_code,
                    billing_city: req.body.billing_city,
                    amount: req.body.amount,
                    products: req.body.products,
                    MerchantId: req.merchant_id,
                    currency: req.currency,
                }).save()
                    .then((transaction) => {
                        res.status(201).json({transaction: transaction})
                    })
                    // TransactionStatusSequelize.build({
                    //     name: app.config.constants.CREATED,
                    //     TransactionId: transaction.id,
                    // })
                    //     .save()
                    //     .then((status) => res.status(201).json({transaction: transaction, status: status}))
                    //     .catch(err => console.error(err));
                    // })
                    .catch((err) => {
                        if (err.name === "SequelizeValidationError") {
                            res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
                        } else {
                            res.sendStatus(500);
                        }
                    });
            } else {
                res.status(400).json(checkUserInformations(req.body));
            }

        } else {
            res.status(400).json({general: "Need merchant credentials"});
        }

    }

    async function get(req, res) {
        return TransactionSequelize.findByPk(req.params.id, {
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
            },
        )
            .then((data) => (data ? res.json(data) : res.sendStatus(data)))
            .catch((err) => console.log(err) || res.sendStatus(500));
    }

    function put(req, res) {
        return TransactionSequelize.update(req.body, {where: {id: req.params.id}})
            .then((data) => (data ? res.json(data) : res.sendStatus(404)))
            .catch((err) => {
                if (err.name === "ValidationError") {
                    res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
                } else {
                    res.sendStatus(500);
                }
            });
    }

    function remove(req, res) {
        return TransactionSequelize.destroy({where: {id: req.params.id}})
            .then((data) => (data ? res.sendStatus(204) : res.sendStatus(404)))
            .catch((err) => res.sendStatus(500));
    }

    function refund(req, res) {
        return TransactionStatusSequelize.build({
            name: app.config.constants.REFUND,
            TransactionId: req.body.transaction,
        }).save()
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500))
            ;
    }

    function checkUserInformations(params, update = false) {

        let errors = {};

        if (!update && Object.keys(params).length !== 7) {
            errors.general = "Vous devez remplir tous les champs";
        }
        if (params.client_firstname.length < 2) {
            errors.firstname = "Votre prénom doit faire plus de 2 caractères";
        }
        if (params.client_lastname.length < 2) {
            errors.lastname = "Votre nom doit faire plus de 2 caractères";
        }
        if (params.billing_address.length === 0) {
            errors.address = "Votre adresse ne peut pas être vide";
        }
        if (!/^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$/.test(params.billing_postal_code)) {
            errors.postal_code = "Votre code postal doit être au format (NNNNN)";
        }
        if (params.billing_city.length === 0) {
            errors.city = "Votre ville ne peut pas être vide";
        }
        if (isNaN(params.amount)) {
            errors.amount = "Le montant du panier est invalide";
        }
        if (params.products.length === 0) {
            errors.products = "Votre panier ne peut pas être vide";
        }

        return errors;
    }

    /*********** MONGOOSE  *****************/
    async function search(req, res) {
        return await TransactionMongoose
            .find(
                {
                    $text: {$search: "\"" + req.query.s + "\""},
                    merchant_id: req.query.merchant
                },
                {score: {$meta: "textScore"}}
            )
            .sort({score: {$meta: "textScore"}})
            .exec(function (err, data) {
                return res.json(data)
            })
    }

    function groupByDate(req, res) {
        let params = [
            {$sort: {"createdAt": -1}},
            {
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    transactionsCount: {$sum: 1}
                },
            },
        ];
        if (req.query.merchant || req.user.merchant_id) {
            const merchant_id = req.query.merchant || req.user.merchant_id
            params = [{$match: {"merchant_id": merchant_id.toString()}}, ...params]
        }

        TransactionMongoose.aggregate(params,
            function (err, results) {
                if (err) throw err;
                res.json(results);
            }
        )
    }

    function amountByDate(req, res) {
        let params = [
            {$sort: {"createdAt": -1}},
            {
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    amount: {$sum: "$amount"}
                },
            },
        ]
        if (req.query.merchant || req.user.merchant_id) {
            const merchant_id = req.query.merchant || req.user.merchant_id
            params = [{$match: {"merchant_id": merchant_id.toString()}}, ...params]
        }
        TransactionMongoose.aggregate(params,
            function (err, results) {
                if (err) throw err;
                res.json(results);
            }
        )
    }
};
