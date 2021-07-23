import React, { useEffect, useState } from "react";
import { Button, Grid, Card, CardContent, InputAdornment } from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { schemaUpdateUser } from "../../../config/schema";
import { useAuth } from "../../../context/AuthContext";
import { formatErrors, formatPhone, toBase64 } from "../../../helpers/Utils";
import SpinLoader from "../../Custom/SpinLoader";
import ModalPassword from "./ModalPassword";
import LoadingButton from "../../Custom/Button/LoadingButton";
import ModalDelete from "./ModalDelete";
import { useGlobalStyles } from "../../../config/theme";
import { useSnackbar } from "notistack";
import { GENDERS } from "../../../config/constant";
import CustomSelect from "../../Custom/Form/CustomSelect";
import CapitalizeButton from "../../Custom/Button/CapitalizeButton";
import FrontPage from "../../Custom/FrontPage";
import CustomTextField from "../../Custom/Form/CustomTextField";
import FileUpload from "../../Custom/Form/FileUpload";
import ErrorButton from "../../Custom/Button/ErrorButton";
import { useHistory } from "react-router-dom";
import { RT_ROOT } from "../../../config/routes";

const Profile = () => {
  const classes = useGlobalStyles();
  const { user, actions } = useAuth();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, setError, setValue, control } = useForm({
    resolver: yupResolver(schemaUpdateUser),
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    let isCancelled = false;

    actions.fetchUser(user.id).then((result) => {
      if (!isCancelled) {
        let data = {
          ...result,
          phone: result.phone.replace("+33", ""),
        };
        setProfileData(data);
      }
    });
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = async data => {
    setLoading(true);

    let formatData = {
      ...data,
    };

    if (data.image && data.image.length > 0) {
      formatData = {
        ...formatData,
        image: await toBase64(data.image[0]),
      };
    } else {
      delete formatData.image;
    }

    actions.update({
      ...formatData,
      phone: formatPhone(formatData),
    }).then(() => {
      enqueueSnackbar(t("security.success.profile"), { variant: "success" });
      setLoading(false);
    }).catch(e => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  const signOut = () => {
    actions.signOut();
    history.push(RT_ROOT);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <FrontPage
      leftButton={<Button color="primary" variant="outlined" onClick={goBack}>{t("button.back")}</Button>}
      title="security.account"
      maxWidth="md"
      rightButton={<ErrorButton onClick={signOut}>{t("security.signout")}</ErrorButton>}>
      <Card elevation={0}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!profileData && <SpinLoader/>}
            {profileData &&
            <Grid container spacing={2}>
              <Grid item sm={4} xs={1}/>
              <Grid item sm={4} xs={10}>
                <FileUpload
                  defaultValue={profileData.image ? profileData.image : null}
                  register={register}
                  setValue={setValue}
                  name="image"
                  label="user.image"
                  error={errors.image}
                />
              </Grid>
              <Grid item sm={4} xs={1}/>
              <Grid item xs={12}>
                <CustomTextField
                  errors={errors}
                  register={register}
                  fullWidth
                  required
                  name="email"
                  type="email"
                  data={profileData}
                  labelForm={"user"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  errors={errors}
                  register={register}
                  fullWidth
                  required
                  autoComplete="family-name"
                  name="lastname"
                  data={profileData}
                  labelForm={"user"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  errors={errors}
                  register={register}
                  fullWidth
                  required
                  autoComplete="given-name"
                  name="firstname"
                  data={profileData}
                  labelForm={"user"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  errors={errors}
                  register={register}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+33</InputAdornment>,
                  }}
                  autoComplete="phone"
                  name="phone"
                  data={profileData}
                  labelForm={"user"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomSelect
                  translateLabel
                  defaultValue="MAN"
                  name="gender"
                  label="user.gender.label"
                  control={control}
                  options={GENDERS}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LoadingButton
                  style={{ marginTop: 0 }}
                  loading={loading}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary">
                  {t("button.update")}
                </LoadingButton>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button type="button" fullWidth variant="contained" color="primary"
                        onClick={() => setOpen(true)}>
                  {t("security.updatePassword")}
                </Button>
              </Grid>
            </Grid>
            }
          </form>
        </CardContent>
      </Card>
      <ModalPassword setOpen={setOpen} open={open} user={user}/>
      <ModalDelete setOpen={setOpenDelete} open={openDelete}/>
      <div className={classes.textRight}>
        <CapitalizeButton
          variant="text" size="small"
          onClick={() => setOpenDelete(true)}>{t("security.delete")}</CapitalizeButton>
      </div>
    </FrontPage>
  );
};

export default Profile;
