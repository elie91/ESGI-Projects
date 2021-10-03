import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useGlobalStyles } from "../../../config/theme";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    borderBottom: "1px solid rgba(22, 24, 35, 0.2)",
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  subscribeButton: {
    marginLeft: "auto",
  },
  video: {
    borderRadius: 5
  }
}));

const VideoItem = () => {

  const classes = useStyles();
  const globalStyles = useGlobalStyles();

  return (
    <Grid item xs spacing={2} className={classes.wrapper} container>
      <Grid item sm={8} xs={8}>
        <div className={globalStyles.alignItemsCenter}>
          <Skeleton className={globalStyles.mr2} variant="circle" width={56} height={56} />
          <div>
            <Typography variant="h6" component="h3"><Skeleton width={250}/></Typography>
            <Typography variant="body2"><Skeleton width={250}/></Typography>
          </div>
        </div>
      </Grid>
      <Grid item xs={4} sm={4}>
        <Skeleton className={classes.subscribeButton} width={100} height={55}/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Skeleton className={classes.video} variant="rect" width="100%" height={550}/>
      </Grid>
      <Grid item xs={12} sm={6}>

        <Skeleton className={globalStyles.mb1} variant="circle" width={40} height={40} />
        <Skeleton className={globalStyles.mb1} variant="circle" width={40} height={40} />
        <Skeleton className={globalStyles.mb1} variant="circle" width={40} height={40} />
      </Grid>
    </Grid>
  );
};

export default VideoItem;
