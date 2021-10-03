import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { schemaClubAdd } from "../../../config/schema";
import { formatDescription, formatErrors, toBase64 } from "../../../helpers/Utils";
import useClub from "../../../hooks/useClub";
import { useParams } from "react-router-dom";
import FormClub from "./FormClub";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { FormControlLabel, Switch } from "@material-ui/core";

const EditClub = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  let params = useParams();
  const { actions } = useClub();
  const { register, handleSubmit, formState: { errors }, setValue, setError, control } = useForm({
    resolver: yupResolver(schemaClubAdd),
  });
  const [data, setData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let isCancelled = false;
    actions.fetchClub(params.id)
      .then((data) => {
        if (!isCancelled) {
          setData({
            ...data,
            description: formatDescription(data.description),
          });
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          formatErrors(err, setError, enqueueSnackbar);
        }
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values) => {

    if (values.logo && values.logo.length > 0) {
      values = {
        ...values,
        logo: await toBase64(values.logo[0]),
      };
    } else {
      delete values.logo;
    }

    setLoading(true);
    actions.updateClub({
      ...values,
      id: data.id,
    }).then(() => {
      enqueueSnackbar(t("club.success.edit"), { variant: "success" });
      setLoading(false);
    }).catch((e) => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  const onSwitch = (e, type, object) => {
    actions.updateClub({
      [type]: !object[type],
      id: object.id,
    }).then(() => setData(prev => {
      return {
        ...prev,
        approved: !object[type],
      };
    })).catch(e => {
      formatErrors(e, null, enqueueSnackbar);
    });
  };

  return (
    <AdminPage title="club.update" rightButton={<div>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={!!(data && data.approved)}
            onChange={(e) => onSwitch(e, "approved", data)}
            name="approved"
            inputProps={{ "aria-label": t("product.active") }}
          />
        }
        label={t("club.approved")}
      />
    </div>
    }>
      <FormClub
        label="club"
        data={data}
        edit={true}
        register={register}
        loading={loading}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        setValue={setValue}
        control={control}
      />

    </AdminPage>
  );
};

export default EditClub;
