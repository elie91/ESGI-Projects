module.exports = (Mongoose) => {

  const CurrencyModel = new Mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      }
    },
    {
      collection: "Currency",
    }
  );

  return CurrencyModel;

};