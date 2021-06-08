module.exports = (app) => {
    const User = app.sequelize.models.User;

    return {
        create,
        getAll,
        put
    };

    /**
     * [Create a new Client]
     * @param   {object}    req     Express request
     * @param   {object}    res     Express request
     * @param   {Function}  next    Next middleware
     * @returns {Promise}           returned Promise
     */
    function create(req, res, next) {
        const _check = checkUserAndMerchant(req.body);
        if(Object.keys(_check).length === 0){
            return User.build({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            role: "MERCHANT",
        })
            .save()
            .then((user) => {
                // Create merchant
                app.actions.merchant.post(req, res, user).then(user => res.status(201).json(user))
              .catch((error) => {
                  console.log(error)
                  res.status(400).json(app.helpers.prettifyValidationErrors(error));
              })
            })
            .catch((error) => {
                console.log(error)
                res.status(400).json(app.helpers.prettifyValidationErrors(error));
            })
        }else {
            res.status(400).json(_check);
        }

    }


    /**
     * [put Client]
     * @param   {object}    req     Express request
     * @param   {object}    res     Express request
     * @param   {Function}  next    Next middleware
     * @returns {Promise}           returned Promise
     */
    function getAll(req, res, next) {
        return User.findAll(req.query)
            .then((data) => res.json(data))
            .catch((err) => console.log(err) || res.sendStatus(500));
    }

    function put (req, res) {
        return User.update(req.body, { where: { id: req.params.id } })
            .then((data) => (data ? res.json(data) : res.sendStatus(404)))
            .catch((err) => {
                if (err.name === "ValidationError") {
                    res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
                } else {
                    res.sendStatus(500);
                }
            });
    }

    function checkUserAndMerchant (params, update = false) {
        let errors = {};

        if (!update){
            if (Object.keys(params).length !== 13) {
                errors.general = "Vous devez remplir tous les champs";
            }
        }
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(params.email)) {
            errors.email = "Votre email est invalide";
        }
        if (params.firstname.length < 2) {
            errors.firstname = "Votre prénom doit faire plus de 2 caractères";
        }
        if (params.lastname.length < 2) {
            errors.lastname = "Votre nom doit faire plus de 2 caractères";
        }
        if (!/^[+]*[(]?[0-9]{1,3}[)]?[-\s./0-9]*$/g.test(params.phone)) {
            errors.phone = "Votre numero de téléphone est invalide";
        }
        if (params.password.length < 4) {
            errors.password = "Votre mot de passe doit faire plus de 4 caractères";
        }
        if (params.kbis.length === 0) {
            errors.kbis = "Vous devez envoyé votre kbis";
        }
        if (params.address.length === 0) {
            errors.address = "Votre adresse ne peut pas être vide";
        }
        if (!/^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$/.test(params.postal_code)) {
            errors.postal_code = "Votre code postal doit être au format (NNNNN)";
        }
        if (params.city.length === 0) {
            errors.city = "Votre ville ne peut pas être vide";
        }
        if (!/(http(s?)):\/\//i.test(params.confirmation_url)) {
            errors.confirmation_url = "Votre adresse de confirmation est invalide";
        }
        if (!/(http(s?)):\/\//i.test(params.cancellation_url)) {
            errors.cancellation_url = "Votre adresse d'annulation est invalide";
        }
        if (params.currency.length !== 3){
            errors.currency = "Votre devise est invalide";
        }
        return errors;
    }
};
