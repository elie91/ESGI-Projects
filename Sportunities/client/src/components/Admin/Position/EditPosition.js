import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { schemaPositionAdd } from "../../../config/schema";
import { formatDescription, formatErrors } from "../../../helpers/Utils";
import { useParams } from "react-router-dom";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import FormPosition from "./FormPosition";
import usePosition from "../../../hooks/usePosition";

const EditPosition = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  let params = useParams();
  const { actions } = usePosition();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schemaPositionAdd),
  });
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    actions.fetchPosition(params.id)
      .then(data => {
        if (!isCancelled) {

          setData({
            ...data,
            description: formatDescription(data.description)
          })
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
    setLoading(true);
    actions.updatePosition({
      ...values,
      id: data.id,
    }).then(() => {
      enqueueSnackbar(t("position.success.edit"), { variant: "success" });
      setLoading(false);
    }).catch((e) => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  return (
    <AdminPage title="sport.update">
      <FormPosition
        label="position"
        data={data}
        edit={true}
        register={register}
        loading={loading}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
      />
    </AdminPage>
  );
};

export default EditPosition;
