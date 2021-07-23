import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formatErrors } from "../../../helpers/Utils";
import { useHistory, useParams } from "react-router-dom";
import { RT_ADMIN_SPORTS_EDIT } from "../../../config/routes";
import { schemaPositionAdd } from "../../../config/schema";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import FormPosition from "./FormPosition";
import usePosition from "../../../hooks/usePosition";

const AddPosition = () => {
  const [loading, setLoading] = useState(false);
  const { actions } = usePosition();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schemaPositionAdd),
  });
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { sport } = useParams();

  const onSubmit = async (data) => {
    setLoading(true);

    actions.addPosition({
      ...data,
      sport_id: sport,
    }).then(() => history.push(RT_ADMIN_SPORTS_EDIT.replace(":id", sport)))
      .catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
        setLoading(false);
      });
  };

  return (
    <AdminPage title="position.add">
      <FormPosition
        label="position"
        register={register}
        isLoading={loading}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
      />
    </AdminPage>
  );
};

export default AddPosition;
