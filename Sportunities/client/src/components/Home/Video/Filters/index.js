import React, { useEffect, useState } from "react";
import useSport from "../../../../hooks/useSport";
import { makeStyles, Chip, Divider } from "@material-ui/core";
import useVideos from "../../../../hooks/useVideos";
import { useGlobalStyles } from "../../../../config/theme";
import { formatErrors } from "../../../../helpers/Utils";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(1, 0),
    position: "sticky",
    top: theme.spacing(8),
    [theme.breakpoints.down("xs")]: {
      top: theme.spacing(7),
    },

    zIndex: 10,
    whiteSpace: "nowrap",
    overflowX: "scroll",
    "&::-webkit-overflow-scrolling": "touch",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    backgroundColor: "#f8f9fa",
    "& div": {
      marginRight: "10px",
    },
  },
  subFilters: {
    display: "block",
    marginTop: theme.spacing(1),
  },
}));

const Filters = () => {

  const { selectors: sportSelectors, actions: sportActions } = useSport();
  const { actions: videoActions } = useVideos();
  const [filters, setFilters] = useState({
    sport: null,
  });
  const [filterVisible, setFilterVisible] = useState({
    sport: false,
  });
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const globalStyles = useGlobalStyles();
  const { t } = useTranslation();

  useEffect(() => {
    sportActions.getSports()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, []);

  const handleClick = (key, value) => {
    videoActions.fetchVideos({
      [key]: value,
    })
      .then(() => {
        setFilters(prev => {
          return {
            ...prev,
            [key]: value,
          };
        });
      })
      .catch(e => formatErrors(e, null, enqueueSnackbar));

  };

  const activeFilter = (key, value) => {
    return filters[key] === value;
  };

  const oneFilterIsActive = () => {
    let find = false;
    Object.entries(filters).forEach(item => {
      if (item[1] !== null) {
        find = true;
      }
    });
    return find;
  };

  const subFilterActive = () => {
    return !!filterVisible.sport;
  };

  const handleResetFilters = () => {
    setFilters({
      sport: null,
    });
    setFilterVisible({ sport: false });
    videoActions.fetchVideos()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
  };

  return (
    <>
      <div className={classes.wrapper}>
        {subFilterActive() ?
          <Chip
            label={t("filters.back")}
            variant="outlined"
            color="primary"
            onClick={handleResetFilters}/>
          : <Chip
            key="all"
            label={t("filters.all")}
            color={!oneFilterIsActive() ? "primary" : "default"}
            onClick={handleResetFilters}/>}

        <Chip
          label="Sport"
          color={filterVisible.sport ? "primary" : "default"}
          onClick={() => setFilterVisible({ sport: !filterVisible.sport })}/>
        {filterVisible.sport && (
          sportSelectors.getSports().map(sport => {
            return <Chip
              key={sport.id}
              label={sport.name}
              color={activeFilter("sport", sport.name) ? "primary" : "default"}
              onClick={() => handleClick("sport", sport.name)}/>;
          })
        )}

      </div>
      <Divider className={globalStyles.mb2}/>
    </>
  );
};

export default Filters;
