import React, { useMemo } from "react";
import { TableRow, TableCell } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const TableLoaderGenerator = ({
  numberRow,
  numberColumn,
}) => {

  return useMemo(() =>
      <>
        {Array.from(Array(numberRow), (_, x) => x).map((item, index) =>
          <TableRow key={index}>
            {Array.from(Array(numberColumn), (_, x) => x).map((itemColumn, indexColumn, array) => (
              <TableCell key={indexColumn} align={indexColumn === array.length - 1 ? "right" : "left"}>
                <Skeleton/>
              </TableCell>
            ))}
          </TableRow>,
        )}
      </>

    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [numberRow, numberColumn]);
};

export default TableLoaderGenerator;
