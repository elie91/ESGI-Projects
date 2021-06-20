import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Box, Card, CardContent, Collapse } from "@material-ui/core";
import useEvent from "../../hooks/useEvent";
import { dateFR, getLocalisationDepartments } from "../../helpers/Utils";
import { CustomTooltip } from "../../Custom/CustomTooltip";
import { FiberManualRecord } from "@material-ui/icons";
import { DURATIONS, IMPORTANT } from "../../config/constants";
import TableLoaderGenerator from "../../Custom/TableLoaderGenerator";
import { makeStyles } from "@material-ui/core/styles";
import EventDetail from "../Events/EventDetail";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const EventTable = () => {

  const { selectors, actions } = useEvent();
  const [open, setOpen] = useState(null);
  const classes = useRowStyles();
  //const [page, setPage] = useState(1);

  /*const loadMore = () => {
    actions.getEvents({
      page: page + 1,
    })
      .then((result) => setPage(result.page))
      .catch(e => console.log(e));
  };*/

  useEffect(() => {
    actions.getEvents()
      .catch(e => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card elevation={0}>
      <CardContent>
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>Nom</TableCell>
                <TableCell>Importance</TableCell>
                <TableCell>Début</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell>Durée</TableCell>
                <TableCell>Localisation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!selectors.isLoading() && selectors.getEvents().map((row, index) => {
                const importance = IMPORTANT.find(i => i.id === row.importance);

                return (
                  <React.Fragment key={index}>
                    <TableRow className={classes.root}>
                      <TableCell>
                        <IconButton aria-label="expand row" size="small"
                                    onClick={() => setOpen(index === open ? null : index)}>
                          {index === open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.nom}
                      </TableCell>
                      <TableCell align="right">
                        <CustomTooltip title={importance.name.toUpperCase()}>
                          <span>
                            <IconButton size="small" disabled>
                              <FiberManualRecord style={{ color: importance.color }}/>
                            </IconButton>
                            </span>
                        </CustomTooltip>
                      </TableCell>
                      <TableCell>{dateFR(row.date_deb)}</TableCell>
                      <TableCell>{dateFR(row.date_fin)}</TableCell>

                      <TableCell>{DURATIONS.find(duration => duration.value === row.duree).name}</TableCell>
                      <TableCell>
                        {getLocalisationDepartments(row.localisation).map((elem) => {
                          if (elem) {
                            return elem.name;
                          }
                          return null;
                        }).join(", ")}
                      </TableCell>
                    </TableRow>

                    <TableRow>

                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={index === open} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                           <EventDetail event={row} />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              {selectors.isLoading() && <TableLoaderGenerator numberRow={25} numberColumn={7}/>}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default EventTable;
