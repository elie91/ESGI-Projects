import React, { useCallback, useRef } from "react";
import { useGlobalStyles } from "../../../config/theme";
import Dropzone from "react-dropzone";
import { Button, Card, CardContent, makeStyles, Typography } from "@material-ui/core";
import { CloudUpload as PublishIcon } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  publishIcon: {
    fontSize: 100,
    color: theme.palette.grey.main,
  },
}));

const VideoUpload = ({ setVideo, id, extensions = "video/*" }) => {

  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const classes = useStyles();
  const videoInputRef = useRef(null);

  const onDrop = useCallback(acceptedFiles => {
    handleChange(acceptedFiles, true);
  }, []);

  const handleChange = (event, drop = false) => {
    if (drop) {
      setVideo(event[0]);
    } else {
      setVideo(event.target.files[0]);
    }
  };

  const handleSelectVideoBtn = (event) => {
    event.preventDefault();
    videoInputRef.current.click();
  };

  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <Card elevation={0} className={classes.card}>
            <CardContent className={globalStyles.flexColumnCenter}>
              <PublishIcon className={classes.publishIcon}/>
              <Typography variant="h5" className={globalStyles.mt4}>
                {t("video.chooseVideoUpload")}
              </Typography>

              <Typography className={globalStyles.mt2}>
                {t("video.uploadSecondaryTitle")}
              </Typography>
              <Button type="button"
                      variant="contained"
                      color="primary"
                      className={globalStyles.mt5}
                      onClick={handleSelectVideoBtn}>
                {t("video.selectVideo")}
              </Button>
              <input
                {...getInputProps()}
                type="file"
                accept={extensions}
                id={id}
                onChange={handleChange}
                className={globalStyles.dNone}
                ref={videoInputRef}/>

            </CardContent>
          </Card>
        </div>
      )}
    </Dropzone>
  );
};

export default VideoUpload;
