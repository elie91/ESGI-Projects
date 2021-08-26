module.exports = (SchemaName, faker, models, logger) => {
    logger.info(`[platform-api][faker][${SchemaName}] Loading ${SchemaName} fixtures ...`);
    fs = require('fs');
    const { convertCSVToArray } = require('convert-csv-to-array');
    //const converter = require('convert-csv-to-array');

    const data = fs.readFileSync(__dirname + '/files/phone_dataset.csv', {encoding: 'utf-8'});

    // name, type, url, image, price, starts, review number, questions
    const productArray = convertCSVToArray(data, {
        type: 'array',
        separator: ',', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
    });

    const dates = ["2020-07-10T15:59:26.168Z", "2020-07-11T15:59:26.168Z", "2020-07-12T15:59:26.168Z"];

    // console.log(productArray);

    models.User.findAll({where: {email: "eliebismuth@mail.com"}
    }).then((user) => {
            models.Merchant.findAll({where: {name: "Yves&Co"}}).then((merchant) => {
                fakeData(merchant, 20, user)
            })
        }, (err) => {
            logger.error(`[platform-api][faker][${SchemaName}] Couldn't get user `, err);
        }
    );

    models.User.findAll({where: {email: "tcoichot@mail.com"}
    }).then((user) => {
            models.Merchant.findAll({where: {name: "Google&Co"}}).then((merchant) => {
                fakeData(merchant, 30, user)
            })
        }, (err) => {
            logger.error(`[platform-api][faker][${SchemaName}] Couldn't get user `, err);
        }
    );

    const fakeData = (merchant, nb, user) => {
        for(let i = 0; i < nb; i++){
            let product = productArray[Math.floor(Math.random() * productArray.length)];
            let date = dates[Math.floor(Math.random() * productArray.length)];
            // console.log(product[4], product[0]);
            let fullPrice = parseInt(product[4]);
            models.Transaction.create({
                amount: fullPrice,
                client_firstname: user[0].firstname,
                client_lastname: user[0].lastname,
                billing_address: merchant[0].address,
                billing_postal_code: merchant[0].postal_code,
                billing_city: merchant[0].city,
                products: [
                    {name : product[0], price: (fullPrice/3), quantity: 1},
                    {name : product[0], price: (fullPrice/3), quantity: 1},
                    {name : product[0], price: (fullPrice/3), quantity: 1},
                ],
                currency: "eur",
                payment_method: {
                    fullname: "card name",
                    card: "**** **** **** ",
                    date: "03/21",
                    cvc: "123",
                    type: "VISA",
                },
                MerchantId: merchant[0].id,
                createdAt: date
            })
                .then(async(transaction)=>{
                    // console.log(transaction.id);
                    await models.TransactionStatus.create({
                        TransactionId: transaction.id,
                        name: "PROCESSING"
                    });

                    await models.TransactionStatus.create({
                        TransactionId: transaction.id,
                        name: "PAID"
                    });
                })
                .catch((err) => {
                    logger.error(`[platform-api][faker][${SchemaName}] Couldn't create default Transaction `, err);
                });
        }
    }
};