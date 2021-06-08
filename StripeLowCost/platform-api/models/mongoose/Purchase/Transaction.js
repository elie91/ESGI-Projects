module.exports = (app, Mongoose) => {

    const Transaction = Mongoose.Schema(
        {
            transaction_id: {
                type: Number,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            client_lastname: {
                type: String,
                required: true,
            },
            client_firstname: {
                type: String,
                required: true,
            },
            billing_address: {
                type: String,
                required: true,
            },
            billing_postal_code: {
                type: String,
                required: true,
            },
            billing_city: {
                type: String,
                required: true,
            },
            products: {
                type: Object,
                required: true,
            },
            payment_method: {
                type: Object,
            },
            currency: {
                type: String,
                required: true,
            },
            merchant_id: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
            transactionStatus: [app.mongoose.schemas.TransactionStatus]
        }, {collection: "Transaction"},
    );
    Transaction.index({
        'client_lastname': 'text',
        'client_firstname': 'text',
        'billing_postal_code': 'text',
        'billing_city': 'text',
        'createdAt': 'text',
    });


    return Transaction;
};
