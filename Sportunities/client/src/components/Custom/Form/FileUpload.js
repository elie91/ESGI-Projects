import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  FormHelperText,
  Slider,
  Typography,
  makeStyles,
  FormControl,
  Button,
  Grid, CardContent, Card, InputLabel,
} from "@material-ui/core";
import { useStylesCrop } from "../../../config/theme";
import clsx from "clsx";
import getCroppedImg from "../../../helpers/Image";
import Cropper from "react-easy-crop";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Dropzone from "react-dropzone";
import { Image, InsertDriveFile } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  dNone: {
    display: "none",
  },
  labelDrop: {
    display: "flex",
    flexDirection: "column",
  },
  center: {
    textAlign: "center",
  },
  imgCenter: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: theme.spacing(2),
    maxHeight: "100px",
  },
  imgFluid: {
    maxWidth: "100%",
    height: "auto",
  },
  label: {
    backgroundColor: "#fff",
    padding: theme.spacing(0, 1),
  },
  icon: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "4rem",
  },
  error: {
    color: theme.palette.error.main,
    textAlign: "center"
  }
}));

const FileUpload = ({
  register,
  error,
  name,
  setValue,
  label,
  defaultValue,
  aspectRatio = 1,
  document = false,
  extensions = ".jpeg, .png, .jpg",
}) => {
  const classes = useStyles();
  const classesCrop = useStylesCrop();
  const [preview, setPreview] = useState(defaultValue ? defaultValue : null);
  const [filename, setFilename] = useState(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onClick = useCallback(async () => {

    if (!document) {
      try {
        const croppedImage = await getCroppedImg(
          preview,
          croppedAreaPixels,
          rotation,
        );
        setPreview(croppedImage);
        let blob = await fetch(croppedImage)
          .then(r => r.blob());
        blob.lastModifiedDate = new Date();
        blob.name = filename;
        setOpen(false);
        let list = new DataTransfer();
        let file = new File([blob], filename);
        list.items.add(file);
        setValue(name, list.files);
      } catch (e) {
        console.error(e);
        enqueueSnackbar(t("errors.fileUpload"), { variant: "error" });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixels, rotation, filename, name, preview]);

  const handleChange = (e, drop = false) => {
    if (drop) {
      if (e.length > 0) {
        e.forEach(file => {
          setFilename(file.name);
          if (!document) {
            setPreview(URL.createObjectURL(file));
            setOpen(true);
          }
        });
      } else {
        setPreview(null);
        setFilename(null);
      }

    } else {
      if (e.target.files[0]) {
        setFilename(e.target.files[0].name);
        if (!document) {
          setPreview(URL.createObjectURL(e.target.files[0]));
          setOpen(true);
        }
      } else {
        setPreview(null);
        setFilename(null);
      }
    }

  };

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    handleChange(acceptedFiles, true);
  }, []);

  return (
    <>
      <FormControl variant="outlined" fullWidth className={classes.center}>
        <InputLabel shrink={true} className={classes.label}>{t(label)}</InputLabel>
        <Card variant="outlined">
          <CardContent>
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <label htmlFor={name} className={classes.labelDrop}>
                    {!preview &&
                    <>
                      {document ? <InsertDriveFile className={classes.icon}/> : <Image className={classes.icon}/>}

                    </>
                    }
                    {(preview && !document) &&
                    <img
                      src={preview}
                      className={clsx(classes.imgCenter, classes.imgFluid)}
                      alt=""
                      aria-label={name}/>
                    }
                    <Button disableElevation variant="text" color="primary" type="button" disabled>
                      {filename ? filename : t("fileUpload.drop")}

                    </Button>

                    <input
                      {...getInputProps()}
                      ref={register}
                      id={name}
                      name={name}
                      className={classes.dNone}
                      type="file"
                      onChange={(e) => handleChange(e)}
                      accept={extensions}
                    />


                    {!!error && <FormHelperText className={classes.error}>{t(error.message)}</FormHelperText>}
                  </label>
                </div>
              )}
            </Dropzone>
          </CardContent>
        </Card>

      </FormControl>
      {!document &&
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogContent>
          <div className={classesCrop.cropContainer}>
            <Cropper
              image={preview}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography>{t("fileUpload.zoom")}</Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby={t("fileUpload.zoom")}
                  onChange={(e, zoom) => setZoom(zoom)}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography>{t("fileUpload.rotation")}</Typography>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby={t("fileUpload.rotation")}
                  onChange={(e, rotation) => setRotation(rotation)}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={onClick}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {t("fileUpload.resize")}
                </Button>
              </Grid>
            </Grid>

          </div>
        </DialogContent>
      </Dialog>
      }
    </>
  );
};

export default FileUpload;
