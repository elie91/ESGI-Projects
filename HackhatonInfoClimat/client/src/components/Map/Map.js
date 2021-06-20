import React, { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import * as departments from "../../config/departments.json";
import * as dom from "../../config/dom.json";
import Department from "./Department";
import { Fab } from "@material-ui/core";
import { ZoomOut } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import useMap from "../../hooks/useMap";
import useStation from "../../hooks/useStation";
import L from "leaflet";
import Pin from "../../assets/images/location-pin.svg";

const iconPerson = L.icon({
  iconUrl: Pin,
  iconSize: [16, 16],
  //iconAnchor: [16, 32],
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
});

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 9999,
  },
}));

const Map = ({ position, scrollWheelZoom = false, active, setActive, map, setMap, setActiveStation }) => {

  const classes = useStyles();
  const [polygons, setPolygons] = useState([]);
  const { selectors } = useMap();
  const { selectors: selectorsStation } = useStation();
  const ref = useRef(null);

  const reset = useCallback(() => {
    map.setView(selectors.getMapLocation(), 6);
    setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    setPolygons([...departments.features, ...dom.features]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: "100%" }} ref={ref}>
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={scrollWheelZoom}
        doubleClickZoom={false}
        whenCreated={setMap}
        style={{ height: "calc(100vh - 64px)" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/ltde/ckpy50o5t0wu717o51acn9wdb/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibHRkZSIsImEiOiJja3B4eTR4OXowazRzMnFvYmJzMmZsbjhvIn0.v3VIwiYXmurzuIOvRIPP9A"
        />
        {polygons.map((item, i) =>
          <Department key={i} item={item} active={active} setActive={setActive} setActiveStation={setActiveStation}/>,
        )}
        {!selectorsStation.isLoading() && selectorsStation.getStations().map((station, index) =>
          <Marker
            icon={iconPerson}
            key={index}
            position={[station.latitude, station.longitude]}
            eventHandlers={{
              click: () => {
                setActiveStation(station);
              },
            }}/>,
        )}
      </MapContainer>
      <Fab size="small" onClick={() => reset()} color="primary" aria-label="add" className={classes.fab}>
        <ZoomOut/>
      </Fab>
    </div>
  );
};

export default Map;
