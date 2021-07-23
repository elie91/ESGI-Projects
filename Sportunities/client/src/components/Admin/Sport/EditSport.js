import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { schemaSportAdd } from "../../../config/schema";
import { formatDescription, formatErrors } from "../../../helpers/Utils";
import useSport from "../../../hooks/useSport";
import { useParams } from "react-router-dom";
import FormSport from "./FormSport";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import ListPosition from "../Position/ListPosition";
import usePosition from "../../../hooks/usePosition";
import { useGlobalStyles } from "../../../config/theme";

const EditSport = () => {

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const params = useParams();
  const { actions } = useSport();
  const { actions: actionsPosition } = usePosition();
  const { register, handleSubmit, formState: { errors }, control, setError } = useForm({
    resolver: yupResolver(schemaSportAdd),
  });
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const globalClasses = useGlobalStyles();

  useEffect(() => {
    let isCancelled = false;
    actions.fetchSport(params.id)
      .then(data => {

        if (!isCancelled) {
          setData({
            ...data,
            description: formatDescription(data.description),
          });
        }

        actionsPosition.getPositions({
          sport_id: data.id,
        }).catch((err) => {
          if (!isCancelled) {
            formatErrors(err, setError, enqueueSnackbar);
          }
        });
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
    setLoading(true);
    actions.updateSport({
      ...values,
      id: data.id,
    }).then(() => {
      enqueueSnackbar(t("sport.success.edit"), { variant: "success" });
      setLoading(false);
    }).catch((e) => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  return (
    <AdminPage title="sport.update">
      <FormSport
        label="sport"
        data={data}
        edit={true}
        register={register}
        loading={loading}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
      />
      <div className={globalClasses.mt2}>
        <ListPosition/>
      </div>
    </AdminPage>
  );
};

export default EditSport;
