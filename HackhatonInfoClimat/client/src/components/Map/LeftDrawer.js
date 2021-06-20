import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "../../config/theme";
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  Table, TableBody, TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { ChevronLeft, ChevronRight, Help, FiberManualRecord } from "@material-ui/icons";
import useEvent from "../../hooks/useEvent";
import { dateFR } from "../../helpers/Utils";
import { IMPORTANT } from "../../config/constants";
import { CustomTooltip } from "../../Custom/CustomTooltip";
import TableLoaderGenerator from "../../Custom/TableLoaderGenerator";
import { Waypoint } from "react-waypoint";
import clsx from "clsx";
import { Line } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContent: {
    padding: theme.spacing(1),
  },
  drawerTitle: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  drawerHeader: {
    marginTop: "64px",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar

    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  tutorial: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  openModal: {
    color: theme.palette.primary.main,
    textDecoration: "underline",
    cursor: "pointer",
  },
}));

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: false,
        },
      },
    ],
  },
};

const LeftDrawer = ({ open, setOpen, active, map, activeStation, dataChart }) => {

  const classes = useStyles();
  const [openFilter, setOpenFilter] = useState(false);
  const { selectors, actions } = useEvent();
  const [page, setPage] = useState(1);

  const handleDrawerClose = () => {
    setOpen(prev => !prev);
    map.invalidateSize();
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const loadMore = () => {
    actions.getEvents({
      page: page + 1,
      localisation: active.properties.code,
    })
      .then((result) => setPage(result.page))
      .catch(e => console.log(e));
  };
  const openModal = event => {
    actions.openModal(event);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.drawerHeader}>
        <div className={classes.drawerTitle} style={{ justifyContent: open ? "space-between" : "center" }}>
          {open &&
            <div className={classes.tutorial}>
              <Help color="primary" className={classes.icon} />
              <Typography variant="h6">Tutoriel</Typography>
            </div>
          }
          <IconButton onClick={handleDrawerClose}>
            {!open ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
      </div>
      {open &&
        <>
          <div className={classes.drawerContent}>
            <Typography variant="body2" color="textSecondary">
              Vous pouvez cliquer sur la carte pour obtenir les évenements associés à la position que vous avez
              selectionné
            </Typography>
          </div>
          <Divider />
          {activeStation &&
            <>
              <Line data={dataChart} options={options} />

            </>
          }
          {active !== null && activeStation === null &&
            <div className={classes.drawerContent}>
              <Grid container spacing={2}>
                <Grid item sm={12} xs={12}>
                  <Typography variant="subtitle1">
                    Région {active.properties.nom}
                  </Typography>
                </Grid>
                {/*<Grid item sm={2}>
                <CustomTooltip
                  interactive
                  placement="right"
                  open={openFilter}
                  onClose={handleCloseFilter}
                  onOpen={handleOpenFilter}
                  title={
                    <React.Fragment>
                      <Filters/>
                    </React.Fragment>
                  }
                >
                  <IconButton edge="end" size="small" onClick={() => console.log("k")}>
                    <FilterList/>
                  </IconButton>
                </CustomTooltip>
              </Grid>
            */}
              </Grid>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>N°</TableCell>
                    <TableCell>Imp.</TableCell>
                    <TableCell>Début</TableCell>
                    <TableCell>Fin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {selectors.getEvents() && selectors.getEvents().map((row, index) => {
                    const importance = IMPORTANT.find(i => i.id === row.importance);

                    return (
                      <TableRow key={index} hover onClick={() => openModal(row)} style={{ cursor: "pointer" }}>
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell>
                          <CustomTooltip title={importance.name.toUpperCase()}>
                            <span>
                              <IconButton size="small" disabled>
                                <FiberManualRecord style={{ color: importance.color }} />
                              </IconButton>
                            </span>
                          </CustomTooltip>
                        </TableCell>
                        <TableCell>{dateFR(row.date_deb)}</TableCell>
                        <TableCell>{dateFR(row.date_fin)}</TableCell>
                      </TableRow>
                    );
                  })}
                  {!selectors.isLoading() && selectors.getLength() < selectors.getMetadata().count &&
                    <TableRow>
                      <TableCell colSpan={4} padding="none">
                        <Waypoint
                          onEnter={loadMore}
                        />
                      </TableCell>
                    </TableRow>
                  }
                  {selectors.isLoading() &&
                    <TableLoaderGenerator numberRow={10} numberColumn={4} />
                  }
                  {(!selectors.isLoading() && selectors.isEmpty()) && <Typography>Il n'y a pas d'événement</Typography>}
                </TableBody>

              </Table>
            </div>
          }
        </>
      }
    </Drawer>
  );
};
;

export default LeftDrawer;
