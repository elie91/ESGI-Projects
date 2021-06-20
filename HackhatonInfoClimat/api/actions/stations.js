module.exports = app => {
  const StationsModel = app.models.Stations;
  const ClimatologieJournaliereModel = app.models.ClimatologieJournaliere;

  return {
    getStations,
    getStationsGraph
  };

  async function getStations(req, res) {
    const {
      department
    } = req.query;

    const whereParams = {};
    if (department) {
      whereParams.departement = +department;
    }

    return StationsModel.findAndCountAll({
      where: whereParams,
      offset: 0,
      limit: 100000000,
    }).then(data => res.json(data))
  }

  async function getStationsGraph(req, res) {
    let {
      stationId,
      climatoDate
    } = req.params;

    const whereParams = {};
    if (stationId) {
      whereParams.id_station = stationId;
    }
    climatoDate = climatoDate.split('-');
    const afterDateClima = await app.sequelize.query(
        `SELECT id_station as id, STR_TO_DATE(CONCAT(annee,'-',LPAD(mois,2,'00'),'-',LPAD(jour,2,'00')), '%Y-%m-%d') as climato_date, tn, tx, rr, ens  FROM climato_journaliere 
        WHERE STR_TO_DATE(CONCAT(annee,'-',LPAD(mois,2,'00'),'-',LPAD(jour,2,'00')), '%Y-%m-%d') >= STR_TO_DATE(CONCAT($year,'-',LPAD($month,2,'00'),'-',LPAD($day,2,'00')), '%Y-%m-%d')
        AND id_station = $stationId
        ORDER BY climato_date
        LIMIT 16`,
      {
        bind: {
          year: climatoDate[0],
          month: climatoDate[1],
          day: climatoDate[2],
          stationId: stationId
        },
        type: app.sequelize.QueryTypes.SELECT
      }
    );
    let beforeDateClima = await app.sequelize.query(
      `SELECT id_station as id, STR_TO_DATE(CONCAT(annee,'-',LPAD(mois,2,'00'),'-',LPAD(jour,2,'00')), '%Y-%m-%d') as climato_date, tn, tx, rr, ens  FROM climato_journaliere 
        WHERE STR_TO_DATE(CONCAT(annee,'-',LPAD(mois,2,'00'),'-',LPAD(jour,2,'00')), '%Y-%m-%d') < STR_TO_DATE(CONCAT($year,'-',LPAD($month,2,'00'),'-',LPAD($day,2,'00')), '%Y-%m-%d')
        AND id_station = $stationId
        ORDER BY climato_date DESC  
        LIMIT 15`,
      {
        bind: {
          year: climatoDate[0],
          month: climatoDate[1],
          day: climatoDate[2],
          stationId: stationId
        },
        type: app.sequelize.QueryTypes.SELECT
      }
    );
    beforeDateClima = beforeDateClima.reverse();
    res.json([...beforeDateClima, ...afterDateClima])
  }
};
