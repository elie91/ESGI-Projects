import React, { useEffect, useState } from "react";
import Map from "../Map/Map";
import { lighten, makeStyles } from "@material-ui/core/styles";
import LeftDrawer from "../Map/LeftDrawer";
import useMap from "../../hooks/useMap";
import { Button, useTheme } from "@material-ui/core";
import useStation from "../../hooks/useStation";
import useEvent from "../../hooks/useEvent";
import EventModal from "../Events/EventModal";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  },
  button: {
    position: "absolute",
    zIndex: 9999,
    top: "11vh",
    left: "8vh",
  },
  content: {
    position: "relative",
    flexGrow: 1,
    paddingTop: "8vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "7vh",
    },
  },
}));

const Home = () => {

  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(null);
  const [activeStation, setActiveStation] = useState(null);
  const theme = useTheme();
  const [dataChart, setDataChart] = useState({});
  const [map, setMap] = useState(null);
  const { selectors } = useMap();
  const { actions: actionsStation, selectors: selectorsStation } = useStation();
  const { selectors: eventSelectors } = useEvent();

  const loadStations = () => {
    actionsStation.getStations()
      .catch(e => console.log(e));
  };

  const clearStation = () => {
    actionsStation.clear();
    setDataChart({});
  };

  useEffect(() => {
    if (!open) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (activeStation) {
      setActive(null);
      actionsStation.fetchStationGraph({
        id: activeStation.id,
        date: format(new Date(), "yyyy-MM-dd"),
      }).then(r => {
        setDataChart({
          labels: r.map(item => format(new Date(item.climato_date), "yyyy-MM-dd")),
          datasets: [
            {
              label: "Temperature minimale",
              data: r.map(item => item.tn),
              fill: false,
              backgroundColor: theme.palette.primary.main,
              borderColor: lighten(theme.palette.primary.main, .2),
            },
            {
              label: "Temperature maximal",
              data: r.map(item => item.tx),
              fill: false,
              backgroundColor: theme.palette.error.main,
              borderColor: lighten(theme.palette.error.dark, .2),
            },
          ],
        });

      })
        .catch(e => console.log(e));
    } else {
      setDataChart({});
    }
  }, [activeStation]);

  return (
    <div className={classes.root}>
      <LeftDrawer map={map} open={open} setOpen={setOpen} active={active} activeStation={activeStation}
                  dataChart={dataChart}/>
      <div className={classes.content}>
        <div className={classes.button}>
          {selectorsStation.isEmpty() ?
            <Button variant="contained" color="primary" onClick={loadStations}>Stations</Button>
            : <Button variant="contained" color="primary" onClick={clearStation}>Cacher</Button>
          }

        </div>
        {eventSelectors.isModalOpen() && <EventModal/>}
        <Map
          activeStation={activeStation}
          setActiveStation={setActiveStation}
          map={map}
          setMap={setMap}
          position={selectors.getMapLocation()}
          active={active}
          setActive={setActive}
        />
      </div>
    </div>
  );
};

export default Home;
