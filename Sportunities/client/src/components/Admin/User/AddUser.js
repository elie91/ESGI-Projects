import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formatErrors, formatPhone, toBase64 } from "../../../helpers/Utils";
import { useHistory } from "react-router-dom";
import { RT_ADMIN_USERS } from "../../../config/routes";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import useUser from "../../../hooks/useUser";
import FormUser from "./FormUser";
import { schemaSignUp } from "../../../config/schema";

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const { actions } = useUser();
  const { register, handleSubmit, formState: { errors }, setError, control, setValue } = useForm({
    resolver: yupResolver(schemaSignUp),
  });
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    setLoading(true);

    let formatData = {
      email: data.email,
      lastname: data.lastname,
      firstname: data.firstname,
      birthday: data.birthday,
      confirmPassword: data.confirmPassword,
      password: data.password,
      gender: data.gender,
      phone: data.phone,
      role: data.role,
    };

    if (data.image && data.image.length > 0) {
      formatData = {
        ...formatData,
        image: await toBase64(data.image[0]),
      };
    }
    actions.addUser({
      ...formatData,
      phone: formatPhone(formatData),
    }).then(() => history.push(RT_ADMIN_USERS))
      .catch((e) => {
        console.log(e);
        formatErrors(e, setError, enqueueSnackbar);
        setLoading(false);
      });
  };


  return (
    <AdminPage title="user.add">
      <FormUser
        setValue={setValue}
        control={control}
        label="user"
        register={register}
        isLoading={loading}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
      />
    </AdminPage>
  );
};

export default AddUser;
