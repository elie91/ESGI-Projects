module.exports = app => {
  const HistoricEventsModel = app.models.HistoricEvents;
  const HistoricValuesModel = app.models.HistoricValues;

  return {
    getHistoricEvents,
    getHistoricEventsValues,
    getHistoricEvent,
    getHistoricEventsFiltered
  };

  async function getHistoricEvents(req, res) {
    const {
      page,
      localisation,
      importance,
      duree,
      type,
      startDate,
      endDate
    } = req.query;

    const whereParams = {};
    if (localisation) {
      const value = app.helpers.getDepartmentLocalisation(localisation)
      whereParams.localisation = value ? +value.localisation : null;
    }
    if (importance) {
      whereParams.importance = +importance;
    }
    if (duree) {
      whereParams.duree = +duree
    }
    if (type) {
      whereParams.type = +type;
    }
    if (startDate) {
      whereParams.date_deb = { [app.helpers.operators.gte]: startDate }
    }
    if (endDate) {
      whereParams.date_fin = { [app.helpers.operators.lte]: endDate }
    }

    return HistoricEventsModel.findAndCountAll({
      where: whereParams,
      offset: (!page || page === 1) ? 0 : (page - 1) * 30,
      limit: 30,
      order: [
        ['date_deb', 'DESC']
      ]
    }).then(data => res.json(data))
  }

  async function getHistoricEvent(req, res) {
    return HistoricEventsModel.findOne({
      where: { id: req.params.id }
    })
      .then(data => res.json(data))
  }

  async function getHistoricEventsValues(req, res) {
    const { page } = req.query;
    const { id } = req.params;

    return HistoricValuesModel.findAndCountAll({
      where: {
        id_historic: id
      },
      offset: (!page || page === 1) ? 0 : (page - 1) * 30,
      limit: 30,
    }).then(data => res.json(data))
      .catch(error => {
        console.log(error)
      })
  }

  async function getHistoricEventsFiltered(req, res) {
    const {
      type,
      operator,
      value
    } = req.query;

    const count = await app.sequelize.query(
      `SELECT count(*) as count
        FROM historic_events
        INNER JOIN historic_values ON historic_values.id_historic = historic_events.id
        WHERE historic_values.type = $type
        AND historic_values.valeur ${operator.length > 2 ? ">" : operator} $value
        ORDER BY historic_events.date_deb
        LIMIT 10000000
        `,
      {
        bind: {
          type: type,
          operator: operator,
          value: value,
        },
        type: app.sequelize.QueryTypes.SELECT
      }
    );
    const filteredValue = await app.sequelize.query(
      `SELECT 
        historic_events.id as id,
        historic_events.nom as nom,
        historic_events.localisation as localisation,
        historic_events.importance as importance,
        historic_events.type_cyclone as type_cyclone,
        historic_events.has_image_cyclone as has_image_cyclone,
        historic_events.date_deb as date_deb,
        historic_events.date_fin as date_fin,
        historic_events.duree as duree,
        historic_events.type as type,
        historic_events.description as description,
        historic_events.short_desc as short_desc,
        historic_events.sources as sources,
        historic_events.id_compte as id_compte,
        historic_events.valeur_max as valeur_max,
        historic_events.bs_link as bs_link,
        historic_events.gen_cartes as gen_cartes,
        historic_events.why as why,
        historic_events.tableau_croise as tableau_croise,
        historic_events.tableau_croise_cyclone as tableau_croise_cyclone,
        historic_events.hits as hits,
        historic_events.notes as notes
        FROM historic_events
        INNER JOIN historic_values ON historic_values.id_historic = historic_events.id
        WHERE historic_values.type = $type
        AND historic_values.valeur ${operator.length > 2 ? ">" : operator} $value
        ORDER BY historic_events.date_deb 
        LIMIT 10
        `,
      {
        bind: {
          type: type,
          operator: operator,
          value: value,
        },
        type: app.sequelize.QueryTypes.SELECT
      }
    );

    res.json({
      count: count[0].count,
      rows: filteredValue
    });
  }

};