import React, {useEffect} from "react";
import {Card, CardContent, Grid} from "@material-ui/core";
import {formatErrors} from "../../../../helpers/Utils";
import {useSnackbar} from "notistack";

import CustomSearchSelect from "../../../Custom/Form/CustomSearchSelect";
import FileUpload from "../../../Custom/Form/FileUpload";
import useClub from "../../../../hooks/useClub";
import CustomCheckbox from "../../../Custom/Form/CustomCheckbox";
import ClubForm from "./ClubForm";

const AgentForm = ({ values, watch, register, control, errors, setValue }) => {

  const {actions, selectors} = useClub();
  const {enqueueSnackbar} = useSnackbar();
  const { addClub } = watch();

  useEffect(() => {
    actions.getClubs({
      approved: true
    })
      .catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
  }, []);

  return (
      <Card elevation={0} style={{overflow: "initial"}}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item sm={6} xs={12}>
              <FileUpload
                document
                register={register}
                setValue={setValue}
                name="idCardFront"
                label="agent.documents.idCardFront"
                error={errors.idCardFront}
                extensions=".jpeg, .png, .jpg, .pdf"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FileUpload
                document
                register={register}
                setValue={setValue}
                name="idCardBack"
                label="agent.documents.idCardBack"
                error={errors.idCardBack}
                extensions=".jpeg, .png, .jpg, .pdf"
              />
            </Grid>
            <Grid item sm={7} xs={12}>
              <CustomSearchSelect
                disabled={addClub}
                defaultValue={values ? values.club_id : ""}
                name="club_id"
                required
                control={control}
                options={selectors.getClubs().map(club => {
                  return {
                    value: club.id,
                    label: club.name,
                  };
                })}
                placeholder="user.club"
                label="user.club"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <CustomCheckbox
                control={control}
                name="addClub"
                label={"club.add"}
                defaultValue={false}
              />
            </Grid>
            {addClub &&
            <ClubForm register={register} errors={errors} control={control}/>
            }
          </Grid>
        </CardContent>
      </Card>
  );
};

export default AgentForm;
