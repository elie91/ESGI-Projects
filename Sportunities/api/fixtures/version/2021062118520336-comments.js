module.exports = () => {

  const fakeData = [];
  for (let i = 1; i <= 50; i++) {
    fakeData.push({
      content: "Hello World comment " + i,
      deleted: false,
      owner_id: "3",
      video_id: "30"
    })
  }

  return [
    {
      model: 'Comment',
      update: true,
      data: fakeData
    }
  ];
};
