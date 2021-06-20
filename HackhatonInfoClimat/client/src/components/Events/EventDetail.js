import React, {useCallback, useEffect, useState} from "react";
import {Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress} from "@material-ui/core";
import {getEventImportance, getEventTypeCorrespondance, getLocalisationDepartments, getTemperatureCorrespondance} from "../../helpers/Utils";
import {fetchEventValues} from "../../context/actions/event";


const useStyles = makeStyles((theme) => ({
  cardTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    padding: '5px 0'
  },
  eventDetail: {
    padding: "10px 60px",
  },
  bold: {
    fontWeight: 'bold'
  },
  pt3: {
    paddingTop: "3vh",
  },
  description: {
    paddingTop: "3vh",
    fontStyle: "italic",
    textAlign: 'justify'
  },
  secondaryTitle: {
    color: theme.palette.primary.main,
    fontSize: 20,
    paddingTop: "3vh",
    fontWeight: 'bold'
  }
}));

const EventDetail = ({event}) => {

  console.log("EVENT", event);

  const classes = useStyles();
  const [historicValues, setHistoricValues] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    let format = new Date(date);
    return format.toLocaleDateString(
        "fr-FR",
        {weekday: "long", year: "numeric", month: "long", day: "2-digit"}
    )
  }

  const getEventHistoricValuesTypes = useCallback((value) => {
    const data = getTemperatureCorrespondance(value)
    return data.unit;
  }, [])

  const getEventDepartments = useCallback(() => {
    let data = getLocalisationDepartments(event.localisation);
    if (!data) return;
    return data
        .reduce((acc, region, index) => {
          return <> {acc} {(index === data.length - 1 && data.length > 1) ? 'et en' : 'en'} <span
              style={{fontWeight: 'bold'}}>{region.name}</span> {index === data.length - 1 ? '.' : ','}</>
        }, <></>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const displayEventTypes = useCallback(() => {
    if (event.type.length === 0) return;
    const splitted = event.type.split(',');
    return splitted
        .map(type => getEventTypeCorrespondance(type))
        .reduce((acc, type, index) => {
          return <> {acc} {(index === splitted.length - 1 && splitted.length > 1) ? ' et' : ' '} <span style={{fontWeight: 'bold'}}>{type}</span></>
        }, <></>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchEventValues(event.id)
        .then(data => setHistoricValues(data))
        .then(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (loading) {
    return <Box style={{display: 'flex', justifyContent: 'center'}}>
      <CircularProgress/>
    </Box>
  }

  return (
      <>
        <Typography className={classes.cardTitle}>{event.nom.length > 0 ? event.nom : "L'essentiel"}</Typography>
        <Box className={classes.eventDetail}>
          <Typography className={classes.secondaryTitle}>
            L'essentiel
          </Typography>

          <Typography>Cet événement a débuté le {' '}
            <span className={classes.bold}>
              {formatDate(event.date_deb)}
            </span>
            {' '} et s'est terminé le {' '}
            <span className={classes.bold}>
              {formatDate(event.date_fin)}
            </span>.
          </Typography>
          <Typography>Il est classé comme événement <span className={classes.bold}> {getEventImportance(event.importance)} </span>
            {event.localisation.length > 0 && 'et a eu lieu'}
            {getEventDepartments()}
          </Typography>
          <Typography className={classes.pt3}>
            Il a été classé dans les catégories {displayEventTypes()} et nous avons {' '}
            <span style={{fontWeight: 'bold'}}>{historicValues.count} </span> valeurs qui y sont rattachées.
          </Typography>

          <Typography className={classes.description}>
            {event.short_desc}
          </Typography>

          {event.description.length > 0 && (
              <>
                <Typography className={classes.secondaryTitle}>
                  Dossier
                </Typography>
                <div dangerouslySetInnerHTML={{__html: event.description}}/>
              </>
          )}

          {event.sources.length > 0 && (
              <>
                <Typography className={classes.secondaryTitle}>
                  Sources
                </Typography>
                <Typography dangerouslySetInnerHTML={{__html: event.sources}}/>
              </>
          )}

          {historicValues.count > 0 && (
              <>
                <Typography className={classes.secondaryTitle}>
                  Evénements historiques
                </Typography>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Numéro</TableCell>
                      <TableCell align="right">Valeur</TableCell>
                      <TableCell align="right">Lieu</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Commentaire</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historicValues.rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.id}
                          </TableCell>
                          <TableCell align="right"><Typography
                              className={classes.bold}>{row.valeur} {getEventHistoricValuesTypes(row.type)}</Typography></TableCell>
                          <TableCell align="right">{row.lieu} ({row.dept})</TableCell>
                          <TableCell align="right">{formatDate(row.date)}</TableCell>
                          <TableCell align="right">{row.commentaire}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
          )}

        </Box>
      </>
  )
}

export default EventDetail;