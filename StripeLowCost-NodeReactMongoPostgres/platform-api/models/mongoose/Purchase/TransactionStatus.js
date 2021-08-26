module.exports = (app, Mongoose) => {

    return new Mongoose.Schema(
        {
            name: {
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
            }
        },
        {
            collection: "Transaction_status",
        },
    );
};
