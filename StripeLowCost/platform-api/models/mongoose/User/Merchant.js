module.exports = (app, Mongoose) => {

  return new Mongoose.Schema(
    {
      merchant_id: {
        type: String,
        required: true,
      },
      transactions: [app.mongoose.schemas.Transaction]
    },
    {
      collection: "Merchant",
    },
  );
};
