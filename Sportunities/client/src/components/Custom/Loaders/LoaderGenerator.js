import React, { useMemo } from "react";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const defaultItemPerRow = { xs: 12, sm: 12, md: 12 };

const LoaderGenerator = ({
  height,
  number,
  itemPerRow,
  needContainer = true,
  spacing = 2,
  rounded = false,
  ...props
}) => {

  const getItemPerRow = () => {
    return {
      ...defaultItemPerRow,
      ...itemPerRow,
    };
  };

  return useMemo(() =>
      <>
        {needContainer ?
          <Grid {...props} container spacing={spacing}>
            {Array.from(Array(number), (_, x) => x).map((item, index) =>
              <Grid key={index} item xs={getItemPerRow().xs} sm={getItemPerRow().sm} md={getItemPerRow().md}>
                <Skeleton style={{ borderRadius: rounded ? 5 : 0 }} variant="rect" width="100%" height={height}/>
              </Grid>,
            )}
          </Grid>
          : <>
            {Array.from(Array(number), (_, x) => x).map((item, index) =>
              <Grid key={index} item xs={itemPerRow.xs} sm={itemPerRow.sm} md={itemPerRow.md}>
                <Skeleton style={{ borderRadius: rounded ? 5 : 0 }} variant="rect" width="100%" height={height}/>
              </Grid>,
            )}
          </>}
      </>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [height, itemPerRow, needContainer, spacing, number]);
};

export default LoaderGenerator;
