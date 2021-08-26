module.exports = (app, Mongoose) => {

  return new Mongoose.Schema(
    {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      role: {
        type: String,
        required: true,
      },
      deleted: {
        type: Boolean,
        required: true,
      },
      merchants: [app.mongoose.schemas.Merchant]
    },
    {
      collection: "User",
    },
  );
};
