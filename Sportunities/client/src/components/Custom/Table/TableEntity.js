import React, { useState } from "react";
import CustomTableToolbar from "./TableToolbar";
import CustomTableHead from "./TableHead";
import {
  getComparator, getItemStyleDraggable, handleChangeRowsPerPage,
  handleClick,
  handleRequestSort,
  handleSelectAllClick,
  isSelected,
  stableSort,
} from "../../../helpers/Utils";
import { useGlobalStyles } from "../../../config/theme";
import {
  Table,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  TableBody,
  Container,
  debounce,
  RootRef,
  TablePagination,
  TableContainer, Paper,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Edit, Delete, Reorder, Visibility, CheckCircle } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TableLoaderGenerator from "./TableLoaderGenerator";
import ModalDelete from "../Form/ModalDelete";

const TableEntity = ({
  onDelete,
  onSearch,
  onSwitch,
  onRefresh,
  headCells,
  addLink,
  editLink,
  data,
  metadata,
  keyTranslate,
  loading,
  isEmpty,
  isSelectable = true,
  onChangePage,
  onDragEnd,
  isDraggable = false,
  page,
  orderByDefault = "position",
  setPage,
  filters,
  container = true,
}) => {

  const classes = useGlobalStyles();
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(orderByDefault);
  const [toDelete, setToDelete] = useState(0);
  const [deleteMultiple, setDeleteMultiple] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  const handleDelete = (multiple = true, row) => {
    setToDelete(row);
    setOpen(true);
    setDeleteMultiple(multiple);
  };

  const debouncedSearch = debounce(onSearch, 500);

  const handleClose = () => {
    onDelete(deleteMultiple, toDelete);
    setOpen(false);
  };

  const getNameItemDelete = () => {
    const currentItem = data.find(item => item.id === toDelete);
    if (currentItem) {
      if (currentItem.name) {
        return currentItem.name;
      }
      if (currentItem.title) {
        return currentItem.title;
      }
      return currentItem.id;

    }
    return "";
  };

  const formatValue = (row, item) => {
    let value = null;

    if (item.keyObject) {
      if (row[item.id] !== null) {
        if (item.translate) {
          value = t(row[item.id][item.keyObject]);
        } else {
          value = row[item.id][item.keyObject];
        }
      } else {
        if (item.defaultValue) {
          value = t(item.defaultValue);
        }
      }
    } else {
      if (item.isDate) {
        value = format(new Date(row[item.id]), item.dateFormat ? item.dateFormat : "dd/MM/yyyy");
      } else {
        if (item.translate) {
          value = t(row[item.id]);
        } else {
          if (item.numeric) {
            value = row[item.id].toString().replace(".", ",") + " €";
          } else {
            value = row[item.id];
          }
        }
      }
    }
    return value;
  };

  const actions = headCells.find(item => item.id === "actions");

  const content = () => {
    return (
      <>
        <Paper elevation={0}>
          <CustomTableToolbar
            onRefresh={onRefresh}
            refresh={loading}
            title={t(keyTranslate + ".plural")}
            numSelected={selected.length}
            AddLink={addLink}
            onDelete={handleDelete}
            iconLabel={t(keyTranslate + ".add")}
            keyTranslate={keyTranslate}
            onSearch={debouncedSearch}
            filters={filters}
          />
          <TableContainer>
            <Table size="small" className={classes.table}>
              <CustomTableHead
                keyTranslate={keyTranslate}
                isSelectable={isSelectable}
                isDraggable={isDraggable}
                headCells={headCells}
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={(e) => handleSelectAllClick(e, data, setSelected)}
                onRequestSort={(e, property) => handleRequestSort(e, property, orderBy, order, setOrder, setOrderBy)}
                rowCount={metadata.count ? metadata.count : 0}
              />
              {loading && <TableLoaderGenerator numberRow={10} numberColumn={headCells.length + 1}/>}
              {!loading &&
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-list">
                  {(provided) => (
                    <RootRef rootRef={provided.innerRef}>
                      <TableBody>
                        {stableSort(data, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            const isItemSelected = isSelected(row.id, selected);
                            const labelId = `checkbox-${index}`;

                            return (
                              <Draggable isDragDisabled={!isDraggable} key={row.id}
                                         draggableId={row.id.toString()}
                                         index={index}>
                                {(provided, snapshot) => (
                                  <TableRow
                                    key={row.id}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyleDraggable(
                                      snapshot.isDragging,
                                      provided.draggableProps.style,
                                    )}
                                  >
                                    {isSelectable &&
                                    <TableCell
                                      padding="checkbox"
                                      onClick={(event) => handleClick(event, row.id, setSelected, selected)}>
                                      <Checkbox
                                        color="primary" checked={isItemSelected}
                                        inputProps={{ "aria-labelledby": labelId }}/>
                                    </TableCell>
                                    }
                                    {headCells.map((item, keyItem) => {
                                      if (item.id !== "actions") {
                                        if (item.custom) {
                                          switch (item.nameAction) {
                                            case "onSwitch":
                                              return <TableCell
                                                key={keyItem}>{item.custom(row, onSwitch)}</TableCell>;
                                            default:
                                              return <TableCell
                                                key={keyItem}
                                                onClick={() => history.push(editLink.replace(":id", row.id))}>{item.custom(row)}</TableCell>;

                                          }
                                        } else {
                                          return (
                                            <TableCell
                                              key={keyItem}
                                              onClick={() => history.push(editLink.replace(":id", row.id))}>
                                              {item.boolean && row[item.id] ? <CheckCircle/> : formatValue(row, item)}
                                            </TableCell>
                                          );
                                        }
                                      }
                                      return null;
                                    })}
                                    {actions &&
                                    <>
                                      {actions.read ?
                                        <TableCell align={"right"}>s
                                          <IconButton
                                            onClick={() => history.push(editLink.replace(":id", row.id))}
                                            color="inherit">
                                            <Visibility/>
                                          </IconButton>
                                        </TableCell>
                                        :
                                        <TableCell align={"right"}>
                                          {isDraggable &&
                                          <IconButton color="inherit">
                                            <Reorder/>
                                          </IconButton>
                                          }
                                          <IconButton
                                            onClick={() => history.push(editLink.replace(":id", row.id))}
                                            color="inherit">
                                            <Edit/>
                                          </IconButton>
                                          <IconButton onClick={() => handleDelete(false, row.id)} color="inherit">
                                            <Delete color="error"/>
                                          </IconButton>
                                        </TableCell>
                                      }
                                    </>
                                    }
                                  </TableRow>
                                )}
                              </Draggable>
                            );
                          })}
                        {!loading && isEmpty &&
                        <TableRow>
                          <TableCell colSpan={8} align="center">{t(keyTranslate + ".empty")}</TableCell>
                        </TableRow>
                        }
                        {provided.placeholder}
                      </TableBody>
                    </RootRef>
                  )}
                </Droppable>
              </DragDropContext>
              }
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={metadata.count ? metadata.count : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={(e, newPage) => onChangePage(newPage)}
            onChangeRowsPerPage={(e) => handleChangeRowsPerPage(e, setRowsPerPage, setPage)}
            labelRowsPerPage={t(keyTranslate + ".plural") + " " + t("perPage")}
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}-${to} ${t("of")} ` + (count !== -1 ? count : `more than ${to}`);
            }}
            rowsPerPageOptions={[25]}
          />
        </Paper>
        <ModalDelete
          handleClose={handleClose}
          open={open}
          setOpen={setOpen}
          getNameItemDelete={getNameItemDelete}
        />
      </>
    );
  };

  return (
    container ?
      <Container maxWidth="lg">
        {content()}
      </Container> : content()
  );
};

export default TableEntity;
