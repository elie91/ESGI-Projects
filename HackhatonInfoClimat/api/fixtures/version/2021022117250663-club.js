module.exports = () => {
  return [
    {
      model: 'Club',
      update: true,
      data: [
        {
          name: "Paris",
          city: "Paris",
          postalCode: "75000",
          country: "France",
        },
        {
          name: "Olympique de Marseille",
          city: "Marseille",
          postalCode: "13000",
          country: "France",
        },
      ]
    }
  ];
};
