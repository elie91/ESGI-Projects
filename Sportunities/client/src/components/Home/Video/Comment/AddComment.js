import React, { useState } from "react";
import { makeStyles, InputBase, Paper, IconButton } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Send } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  input: {
    backgroundColor: "#eee",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1.25, 1.5),
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

const AddComment = ({ onSubmit }) => {

  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const addComment = () => {
    const prevValue = value;
    setValue("");
    onSubmit(prevValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addComment();
    }
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <InputBase
        multiline
        onKeyPress={handleKeyPress}
        className={classes.input}
        value={value}
        inputProps={{ "aria-label": "search google maps" }}
        placeholder={t("comments.addPlaceholder")}
        onChange={(e) => setValue(e.target.value)}
      />
      <IconButton onClick={addComment} type="submit" className={classes.iconButton} aria-label={t("comments.publish")}>
        <Send />
      </IconButton>
    </Paper>

  );
};

export default AddComment;
