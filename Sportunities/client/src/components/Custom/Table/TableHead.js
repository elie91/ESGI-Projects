import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

const CustomTableHead = ({headCells, isSelectable, keyTranslate, ...props}) => {
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const {t} = useTranslation();

  return (
    <TableHead>
      <TableRow>
        {isSelectable && onSelectAllClick &&
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{"aria-label": t("selectAll")}}
          />
        </TableCell>
        }
        {headCells.map((headCell, index, array) => {
          return (!headCell.sortable ?
              <TableCell
                key={headCell.id + (headCell.keyObject ? '-' + headCell.keyObject : "")}
                align={index === array.length - 1 ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "default"}>
                {t(headCell.id !== "actions" ? keyTranslate + "." + (headCell.label ? headCell.label : headCell.id) : headCell.id)}
              </TableCell>
              :
              <TableCell
                key={headCell.id + (headCell.keyObject ? '-' + headCell.keyObject : "")}
                align={"left"}
                padding={headCell.disablePadding ? "none" : "default"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                  {order === "desc" ? t("sort.descending") : t("sort.ascending")}
                </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

CustomTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
};

export default CustomTableHead;
