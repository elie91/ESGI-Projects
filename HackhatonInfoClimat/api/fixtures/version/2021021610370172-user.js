module.exports = async (app) => {
  return [
    {
      model: 'User',
      data: [
        {
          email: 'user@sportunities.com',
          password: '$2a$10$GpVXmoAbrkhf34Q.jf4fYeGaStDHFj/IEDw2BPcaQFH.MlGrDAgru',
          firstname: 'Jean',
          lastname: 'User',
          role: ["ROLE_USER"],
          phone: "+33600000000",
          birthday: "2021-04-18 09:52:24.278000 +00:00",
          gender: "MAN",
          image: ""
        },
        {
          email: 'agent@sportunities.com',
          password: '$2a$10$kY8HlDByMII6DNhoWAJKRuCyUxMI1iQOMPYnsnI6kNaGgOUhAkZxa',
          firstname: 'Jean',
          lastname: 'Agent',
          role: ["ROLE_AGENT"],
          phone: "+33600000000",
          birthday: "2021-04-18 09:52:24.278000 +00:00",
          gender: "MAN",
          image: ""
        },
        {
          email: 'player@sportunities.com',
          password: '$2a$10$i6K/BdZYlpjC4VdDVyIDJ.yfokOrnr69zi9pDX62wcug3lezp4NFS',
          firstname: 'Jean',
          lastname: 'Player',
          role: ["ROLE_PLAYER"],
          phone: "+33600000000",
          birthday: "2021-04-18 09:52:24.278000 +00:00",
          gender: "MAN",
          image: ""
        },
        {
          email: 'admin@sportunities.com',
          password: '$2a$10$jaiO2F6awD.Iy6l4itsg2u.IirU3ZcbtiYoNRvu6xd5tMsGbsxDQC',
          firstname: 'Jean',
          lastname: 'Admin',
          role: ["ROLE_ADMIN"],
          phone: "+33600000000",
          birthday: "2021-04-18 09:52:24.278000 +00:00",
          gender: "MAN",
          image: ""
        },
      ]
    }
  ];
};
