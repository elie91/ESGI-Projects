import React from "react";
import { GeoJSON, Tooltip, useMap } from "react-leaflet";
import { useTheme } from "@material-ui/core";
import useEvent from "../../hooks/useEvent";

const Department = ({ item, active, setActive, setActiveStation }) => {

  const theme = useTheme();
  const map = useMap();
  const { actions } = useEvent();

  const isActive = () => {
    return active && active.properties && active.properties.code === item.properties.code;
  };

  return (
    <GeoJSON
      style={{ color: isActive() ? theme.palette.primary.main + "!important" : theme.palette.primary.main }}
      data={item}
      eventHandlers={{
        click: (e) => {
          map.setView(e.latlng, 9, {
            animate: true,
          });
          setActive(item);
          setActiveStation(null);
          actions.getEvents({
            localisation: item.properties.code,
          }).catch(e => console.log(e));
        },
      }}>
      <Tooltip>{item.properties.nom}</Tooltip>
    </GeoJSON>

  );
};

export default Department;
