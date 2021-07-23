module.exports = () => {

  let array = [];

  for (let i = 1; i < 55; i++) {
    const randomHeight = Math.floor(Math.random() * (210 - 120 + 1) + 120);
    const randomWeight = Math.floor(Math.random() * (120 - 30 + 1) + 30);
    const randomClub = Math.floor(Math.random() * (3 - 1 + 1) + 1);
    const randomPosition = Math.floor(Math.random() * (8 - 1 + 1) + 1);

    array.push({
      height: randomHeight,
      weight: randomWeight,
      nationality: "FR",
      owner_id: i,
      club_id: randomClub,
      sport_id: 1,
      position_id: randomPosition,
    });
  }

  return [
    {
      model: "Player",
      data: array,
    },
  ];
};
