import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({

  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const SearchInput = ({ open, setOpen }) => {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => setOpen(prev => !prev)} className={classes.iconButton} aria-label="menu">
        <MenuIcon/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Entrer une adresse"
        inputProps={{ "aria-label": "Entrer une adresse" }}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon/>
      </IconButton>
    </Paper>
  );
};

export default SearchInput;
