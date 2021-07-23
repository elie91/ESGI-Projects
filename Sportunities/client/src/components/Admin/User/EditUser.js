import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { schemaUpdateUser } from "../../../config/schema";
import { formatErrors, formatPhone, toBase64 } from "../../../helpers/Utils";
import { useParams } from "react-router-dom";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useUser from "../../../hooks/useUser";
import FormUser from "./FormUser";

const EditUser = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  let params = useParams();
  const { actions } = useUser();
  const { register, handleSubmit, formState: { errors }, control, setError, setValue } = useForm({
    resolver: yupResolver(schemaUpdateUser),
  });
  const [data, setData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let isCancelled = false;
    actions.fetchUser(params.id)
      .then((data) => {
        if (!isCancelled) {
          setData({
            ...data,
            phone: data.phone.replace("+33", "0"),
          });
        }
      }).catch((err) => {
      if (!isCancelled) {
        formatErrors(err, setError, enqueueSnackbar);
      }
    });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {

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
    actions.updateUser({
      ...formatData,
      phone: formatPhone(formatData),
      id: formatData.id,
    }).then(() => {
      enqueueSnackbar(t("user.success.edit"), { variant: "success" });
      setLoading(false);
    }).catch((e) => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  return (
    <AdminPage title="user.update">
      <FormUser
        setValue={setValue}
        label="user"
        data={data}
        edit={true}
        register={register}
        loading={loading}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
      />
    </AdminPage>
  );
};

export default EditUser;
