import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { RT_ROOT, RT_SIGNUP_NEXT_STEP } from "../../../config/routes";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import GenericForm from "./SignUp/GenericForm";
import LoadingButton from "../../Custom/Button/LoadingButton";
import { formatErrors, formatPhone, toBase64 } from "../../../helpers/Utils";
import { useForm } from "react-hook-form";
import { schemaSignUp } from "../../../config/schema";
import FrontPage from "../../Custom/FrontPage";
import { yupResolver } from "@hookform/resolvers/yup";

const SignUp = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { actions } = useAuth();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const { register, handleSubmit, formState: { errors }, control, setError, setValue } = useForm({
    resolver: yupResolver(schemaSignUp),
  });

  const onSubmit = async data => {
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

    actions.signUp({
      ...formatData,
      phone: formatPhone(formatData),
    }).then(() => {
      actions.signIn(data.email, data.password)
        .then(() => {
          enqueueSnackbar(t("security.success.signup"), { variant: "info" });
          history.push(RT_SIGNUP_NEXT_STEP);
        })
        .catch(e => {
          formatErrors(e, setError, enqueueSnackbar);
          setLoading(false);
        });
    }).catch(e => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  return (user ? <Redirect to={RT_ROOT}/> :
      <FrontPage title="security.welcome.title" maxWidth="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <GenericForm register={register} errors={errors} control={control} setValue={setValue}/>
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {t("security.signup")}
          </LoadingButton>
        </form>
      </FrontPage>

  );

};

export default SignUp;
