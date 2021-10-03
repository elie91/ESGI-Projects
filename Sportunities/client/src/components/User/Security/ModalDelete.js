import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import CustomDialog from "../../Custom/CustomDialog";
import { Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../../helpers/Utils";

const ModalDelete = ({ setOpen, open }) => {
  const { t } = useTranslation();
  const { actions, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    actions.deleteUser(user.id)
      .then(() => {
        actions.signOut();
      })
      .catch((e) => {
        setLoading(false);
        formatErrors(e, null, enqueueSnackbar);
      });
  };

  return (
    <CustomDialog
      id="delete-user"
      open={open}
      loading={loading}
      setOpen={setOpen}
      onSubmit={onSubmit}
      maxWidth="sm"
      errorButton
      title="security.delete"
      textSubmitButton="security.delete"
    >
      <Typography variant="body1">{t("security.deleteAccount")}</Typography>
    </CustomDialog>
  );
};

export default ModalDelete;
