import React from "react";
import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useGlobalStyles } from "../../config/theme";

const LoaderConversations = () => {

  const classes = useGlobalStyles();

  return (
    <>

      {Array.from(Array(10), (_, x) => x).map((item, index) =>
        <ListItem key={index}>
          <ListItemAvatar>
            <Skeleton variant="circle" height={40} width={40}/>
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton className={classes.mb1} variant="rect" height={15} width="100%"/>}
            secondary={<Skeleton variant="rect" height={10} width="100%"/>}
          />
        </ListItem>,
      )}
    </>
  );
};

export default LoaderConversations;
