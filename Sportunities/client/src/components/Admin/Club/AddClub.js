import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formatErrors, toBase64 } from "../../../helpers/Utils";
import useClub from "../../../hooks/useClub";
import { useHistory } from "react-router-dom";
import { RT_ADMIN_CLUBS } from "../../../config/routes";
import FormClub from "./FormClub";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import { schemaClubAdd } from "../../../config/schema";

const AddClub = () => {
  const [loading, setLoading] = useState(false);
  const { actions } = useClub();

  const { register, handleSubmit, formState: { errors }, setError, setValue, control } = useForm({
    resolver: yupResolver(schemaClubAdd),
  });

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {

    if (data.logo && data.logo.length > 0) {
      data = {
        ...data,
        logo: await toBase64(data.logo[0]),
      };
    } else {
      delete data.logo;
    }

    setLoading(true);
    actions.addClub({
      ...data,
      approved: true,
    }).then(() => history.push(RT_ADMIN_CLUBS))
      .catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
        setLoading(false);
      });
  };

  return (
    <AdminPage title="club.add">
      <FormClub
        label="club"
        register={register}
        isLoading={loading}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        setValue={setValue}
        control={control}
      />
    </AdminPage>
  );
};

export default AddClub;
