import React, { useEffect } from "react";
import { Card, CardContent, Grid, InputAdornment, Typography } from "@material-ui/core";
import useSport from "../../../../hooks/useSport";
import { formatErrors } from "../../../../helpers/Utils";
import { useSnackbar } from "notistack";
import CustomSelect from "../../../Custom/Form/CustomSelect";
import { COUNTRIES } from "../../../../config/constant";
import CustomSearchSelect from "../../../Custom/Form/CustomSearchSelect";
import CustomTextField from "../../../Custom/Form/CustomTextField";
import usePosition from "../../../../hooks/usePosition";
import CustomCheckbox from "../../../Custom/Form/CustomCheckbox";
import useClub from "../../../../hooks/useClub";
import ClubForm from "./ClubForm";

const PlayerForm = ({ values, watch, register, control, errors }) => {

  const { actions, selectors } = useSport();
  const { actions: actionsPositions, selectors: selectorsPositions } = usePosition();
  const { actions: actionsClub, selectors: selectorsClub } = useClub();
  const { enqueueSnackbar } = useSnackbar();
  const { sport_id, addClub } = watch();

  useEffect(() => {
    actions.getSports()
      .catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
    actionsClub.getClubs({
      approved: true,
    })
      .catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
  }, []);

  useEffect(() => {
    if (sport_id) {
      actionsPositions.getPositions({
        sport_id: sport_id ? sport_id : null,
      }).catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
    }
  }, [sport_id]);

  return (
    <Card elevation={0} style={{ overflow: "initial" }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item sm={6} xs={12}>
            {selectors.getSports() &&
            <CustomSelect
              errors={errors}
              defaultValue={values ? values.sport_id : ""}
              control={control}
              options={selectors.getSports().map(sport => {
                return {
                  value: sport.id,
                  label: sport.name,
                };
              })}
              label="user.sport"
              name="sport_id"
            />
            }
          </Grid>
          <Grid item sm={6} xs={12}>
            <CustomSelect
              defaultValue={values ? values.position_id : ""}
              control={control}
              options={sport_id ? selectorsPositions.getPositionsBySport(sport_id).map(position => {
                return {
                  value: position.id,
                  label: position.value,
                };
              }) : []}
              label="user.position"
              name="position_id"
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <CustomSearchSelect
              defaultValue={values ? values.nationality : ""}
              name="nationality"
              errors={errors}
              control={control}
              options={COUNTRIES.map(item => {
                return {
                  value: item.code,
                  label: item.name,
                };
              })}
              placeholder="user.nationality"
              label="user.nationality"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <CustomTextField
              data={values}
              errors={errors}
              register={register}
              fullWidth
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <Typography>Kg</Typography>
                </InputAdornment>,
              }}
              name="weight"
              labelForm="user"
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <CustomTextField
              data={values}
              errors={errors}
              register={register}
              fullWidth
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <Typography>cm</Typography>
                </InputAdornment>,
              }}
              name="height"
              labelForm="user"
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <CustomSearchSelect
              disabled={addClub}
              defaultValue={values ? values.club_id : ""}
              name="club_id"
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

export default PlayerForm;
