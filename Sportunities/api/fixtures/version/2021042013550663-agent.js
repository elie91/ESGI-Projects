module.exports = () => {

  let array = [];

  for (let i = 55; i < 110; i++) {
    const randomClub = Math.floor(Math.random() * (3 - 1 + 1) + 1);

    array.push({
      club_id: randomClub,
      owner_id: i,
    });

  }

  return [
    {
      model: "Agent",
      data: array,
    },
  ];
};
