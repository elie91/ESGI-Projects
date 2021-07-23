module.exports = () => {

  const fakeData = [];
  const videosUrl = [
    {
      filename: "1624612527636-foot_1.mp4",
      url: "https://sportunities-bucket-pa.s3.eu-west-3.amazonaws.com/uploads/1624612527636-foot_1.mp4",
    },
    {
      filename: "1624612656512-foot_2.mp4",
      url: "https://sportunities-bucket-pa.s3.eu-west-3.amazonaws.com/uploads/1624612656512-foot_2.mp4",
    },
    {
      filename: "1624612835696-foot_3.mp4",
      url: "https://sportunities-bucket-pa.s3.eu-west-3.amazonaws.com/uploads/1624612835696-foot_3.mp4",
    },
    {
      filename: "1624612999136-foot_4.mp4",
      url: "https://sportunities-bucket-pa.s3.eu-west-3.amazonaws.com/uploads/1624612999136-foot_4.mp4",
    },
  ];
  for (let i = 1; i <= 50; i++) {
    const randomOwner = Math.floor(Math.random() * (3 - 1 + 1) + 1);
    const random = videosUrl[Math.floor(Math.random() * videosUrl.length)];

    fakeData.push({
      title: "Nice goal like CR7 Video " + i,
      filename: random.filename,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,\n" +
        "molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum\n" +
        "numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium\n" +
        "optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis\n" +
        "obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam\n" +
        "nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,\n" +
        "tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,\n" +
        "quia.",
      url: random.url,
      owner_id: randomOwner,
      sport_id: 1,
      deleted: false,
    });
  }

  return [
    {
      model: "Video",
      update: true,
      data: fakeData,
    },
  ];
};
