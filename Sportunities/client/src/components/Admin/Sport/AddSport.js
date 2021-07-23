import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formatErrors } from "../../../helpers/Utils";
import useSport from "../../../hooks/useSport";
import { useHistory } from "react-router-dom";
import { RT_ADMIN_SPORTS } from "../../../config/routes";
import { schemaSportAdd } from "../../../config/schema";
import FormSport from "./FormSport";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";

const AddSport = () => {
  const [loading, setLoading] = useState(false);
  const { actions } = useSport();
  const { register, handleSubmit, formState: { errors }, setError, control } = useForm({
    resolver: yupResolver(schemaSportAdd),
  });
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    setLoading(true);

    actions.addSport({
      ...data,
    }).then(() => history.push(RT_ADMIN_SPORTS))
      .catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
        setLoading(false);
      });
  };

  return (
    <AdminPage title="sport.add">
      <FormSport
        label="sport"
        register={register}
        isLoading={loading}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        control={control}
      />
    </AdminPage>
  );
};

export default AddSport;
