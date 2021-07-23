import React, {useEffect} from "react";
import { Divider, Grid, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import SpinLoader from "../../Custom/SpinLoader";
import CustomDatePicker from "../../Custom/Form/CustomDatePicker";
import CustomTextField from "../../Custom/Form/CustomTextField";
import CustomCheckbox from "../../Custom/Form/CustomCheckbox";
import CustomSelect from "../../Custom/Form/CustomSelect";
import { useAuth } from "../../../context/AuthContext";
import usePosition from "../../../hooks/usePosition";
import { formatErrors } from "../../../helpers/Utils";
import { useSnackbar } from "notistack";
import useClub from "../../../hooks/useClub";
import CustomSearchSelect from "../../Custom/Form/CustomSearchSelect";
import {subMonths} from "date-fns";
import ClubForm from "../../User/Security/SignUp/ClubForm";

const FormExperience = ({
  data,
  errors,
  register,
  edit = false,
  label,
  control,
  watch,
}) => {

  const { t } = useTranslation();
  const { user } = useAuth();
  const { selectors: selectorsPositions, actions: actionsPositions } = usePosition();
  const { selectors: selectorsClub, actions: actionsClub } = useClub();
  const { enqueueSnackbar } = useSnackbar();
  const { actual, addClub } = watch();

  useEffect(() => {
    actionsClub.getClubs({
      approved: true,
    }).catch(e => {
      formatErrors(e, null, enqueueSnackbar);
    });
    if (user.player.sport_id) {
      actionsPositions.getPositions({
        sport_id: user.player.sport_id,
      }).catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
    }
  }, []);

  return (
    <>
      {edit && !data && <SpinLoader/>}
      {((edit && data) || !edit) &&
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <CustomTextField
            errors={errors}
            register={register}
            fullWidth
            required
            name="titleExperience"
            data={data}
            labelForm={label}
          />
        </Grid>
        <Grid item xs={12} sm={data ? 12 : 7}>

          <CustomSearchSelect
            disabled={addClub}
            name="club"
            required
            control={control}
            options={selectorsClub.getClubs().map(club => {
              return {
                value: club.id,
                label: club.name,
              };
            })}
            placeholder="user.club"
            label="user.club"
            defaultValue={data && data.club ? data.club : ""}
          />
        </Grid>
        {!data &&
        <Grid item xs={12} sm={5}>
          <CustomCheckbox
            control={control}
            name="addClub"
            label={"club.add"}
            defaultValue={false}
          />
        </Grid>
        }
        {addClub &&
        <>
          <ClubForm control={control} register={register} errors={errors}/>
          <Grid item xs={12}>
            <Divider/>
          </Grid>
        </>
        }
        <Grid item xs={12} sm={12}>
          <CustomSelect
            errors={errors}
            control={control}
            options={selectorsPositions.getPositionsBySport(user.player.sport_id).map(position => {
              return {
                value: position.id,
                label: position.value,
              };
            })}
            label="user.position"
            name="position"
            defaultValue={data && data.position ? data.position : ""}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomCheckbox
            control={control}
            name="actual"
            label={label + ".already"}
            defaultValue={data && data.endDate === null}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            errors={errors}
            name="startDate"
            label={t(label + ".date.start")}
            control={control}
            format="MM/yyyy"
            views={["year", "month"]}
            required
            defaultValue={(data && data.startDate) ? new Date(data.startDate) : subMonths(new Date(), 1)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {actual ?
            <TextField fullWidth variant="outlined" disabled value={t("experience.date.today")}/>
            : <CustomDatePicker
              errors={errors}
              name="endDate"
              label={t(label + ".date.end")}
              control={control}
              format="MM/yyyy"
              views={["year", "month"]}
              required
              defaultValue={(data && data.endDate) ? new Date(data.endDate) : new Date()}
            />}
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomTextField
            errors={errors}
            register={register}
            fullWidth
            name="description"
            data={data}
            labelForm={label}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      }
    </>
  );

};

export default FormExperience;
