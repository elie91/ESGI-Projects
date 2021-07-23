import React, { useMemo } from "react";
import { TableRow, TableCell, TableBody, IconButton } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Delete, Edit } from "@material-ui/icons";

const TableLoaderGenerator = ({
  numberRow,
  numberColumn,
}) => {

  return useMemo(() =>
      <TableBody>
        {Array.from(Array(numberRow), (_, x) => x).map((item, index) =>
          <TableRow key={index}>
            {Array.from(Array(numberColumn), (_, x) => x).map((itemColumn, indexColumn, array) => (
              <TableCell key={indexColumn} align={indexColumn === array.length - 1 ? "right" : "left"}>
                {indexColumn === array.length - 1 ?
                  <>
                    <IconButton
                      disabled
                      color="inherit">
                      <Edit/>
                    </IconButton>
                    <IconButton
                      disabled
                      color="inherit">
                      <Delete/>
                    </IconButton>
                  </>
                  : <Skeleton/>}

              </TableCell>
            ))}
          </TableRow>,
        )}
      </TableBody>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [numberRow, numberColumn]);
};

export default TableLoaderGenerator;
