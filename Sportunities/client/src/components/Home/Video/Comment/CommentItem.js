import React from "react";
import clsx from "clsx";
import CustomAvatar from "../../../Custom/CustomAvatar";
import { Typography } from "@material-ui/core";
import { useGlobalStyles } from "../../../../config/theme";
import { makeStyles } from "@material-ui/core/styles";
import { formatDifferenceBetweenDate } from "../../../../helpers/Utils";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    marginRight: theme.spacing(2),
  },
  date: {
    fontSize: 10,
    marginLeft: theme.spacing(1),
  },
  content: {
    wordBreak: "break-word"
  }
}));

const CommentItem = ({ comment, innerRef }) => {
  const globalStyles = useGlobalStyles();
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={clsx(globalStyles.w100, globalStyles.mb3)} ref={innerRef}>
      <div className={globalStyles.alignItemsCenter}>
        <CustomAvatar user={comment.user} className={classes.avatar}/>
        <div className={clsx(globalStyles.flexColumn, globalStyles.w100)}>
          <Typography variant="subtitle1" className={clsx(globalStyles.fontWeightBold, globalStyles.alignItemsCenter)}>
            {comment.user.lastname} {comment.user.firstname} <Typography component="span" className={classes.date}>
            {t("betweenDate", { time: formatDifferenceBetweenDate(new Date(), new Date(comment.createdAt)) })}
          </Typography>
          </Typography>
          <Typography variant="body1" className={classes.content}>{comment.content}</Typography>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
