import React, { useEffect } from "react";
import {
  Button,
  Drawer, Hidden,
  IconButton,
  makeStyles,
  TextField,
  Typography, useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import CustomSearchSelect from "../../Custom/Form/CustomSearchSelect";
import CustomSelect from "../../Custom/Form/CustomSelect";
import {
  DRAWER_FILTER_WIDTH,
  FILTER_MAX_BIRTHDAY, FILTER_MAX_HEIGHT,
  FILTER_MIN_BIRTHDAY,
  FILTER_MIN_HEIGHT,
} from "../../../config/constant";
import { useForm } from "react-hook-form";
import usePosition from "../../../hooks/usePosition";
import useClub from "../../../hooks/useClub";
import { formatErrors } from "../../../helpers/Utils";
import { useSnackbar } from "notistack";
import useSport from "../../../hooks/useSport";
import { useTranslation } from "react-i18next";
import { useGlobalStyles } from "../../../config/theme";
import usePlayer from "../../../hooks/usePlayer";
import RangeSlider from "../../Custom/Form/CustomSlider";
import subYear from "date-fns/subYears";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: DRAWER_FILTER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_FILTER_WIDTH - theme.spacing(4),
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },
  mobileDrawer: {
    width: DRAWER_FILTER_WIDTH,
  },
}));

const Filters = ({ handleDrawerClose, open, handleDrawerOpen }) => {

  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const theme = useTheme();
  const { actions } = usePlayer();
  const { register, errors, control, watch, reset } = useForm();
  const { actions: actionsSport, selectors: selectorsSport } = useSport();
  const { actions: actionsPositions, selectors: selectorsPositions } = usePosition();
  const { actions: actionsClub, selectors: selectorsClub } = useClub();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { search, club, birthday, height, sport, position } = watch();

  useEffect(() => {
    actionsClub.getClubs({
      approved: true,
    }).catch(e => {
      formatErrors(e, null, enqueueSnackbar);
    });
    actionsSport.getSports()
      .catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
  }, []);

  useEffect(() => {
    if (sport) {
      actionsPositions.getPositions({
        sport_id: sport ? sport : null,
      }).catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
    }
  }, [sport]);

  useEffect(() => {
    if (mobile) {
      if (open) {
        handleDrawerClose();
      }
    } else {
      if (!open) {
        handleDrawerOpen();
      }
    }
  }, [mobile]);

  useEffect(() => {
    let params = {};
    if (search && search !== "") {
      params = {
        ...params,
        user: {
          ...params.user,
          firstname: search,
          lastname: search,
        },
      };
    }

    if (club && club !== "") {
      params = {
        ...params,
        club,
      };
    }

    if (birthday && birthday !== "") {
      if (birthday[0] !== FILTER_MIN_BIRTHDAY || birthday[1] !== FILTER_MAX_BIRTHDAY) {
        params = {
          ...params,
          birthday: {
            min: format(subYear(new Date(), birthday[0]), "yyyy-MM-dd"),
            max: format(subYear(new Date(), birthday[1]), "yyyy-MM-dd"),
          },
        };
      }
    }

    if (height && height !== "") {
      if (height[0] !== FILTER_MIN_HEIGHT || height[1] !== FILTER_MAX_HEIGHT) {
        params = {
          ...params,
          height: {
            min: height[0],
            max: height[1],
          },
        };
      }
    }

    if (sport && sport !== "") {
      params = {
        ...params,
        sport,
      };
    }

    if (position && position !== "") {
      params = {
        ...params,
        position,
      };
    }

    if (Object.entries(params).length > 0) {
      actions.getPlayers(params)
        .catch(e => formatErrors(e, null, enqueueSnackbar));
    }

  }, [search, club, birthday, height, sport, position]);

  const clearFilter = () => {
    reset({
      birthday: [FILTER_MIN_BIRTHDAY, FILTER_MAX_BIRTHDAY],
      height: [FILTER_MIN_HEIGHT, FILTER_MAX_HEIGHT],
      search: "",
      club: "",
      sport: "",
      position: "",
    });

    actions.getPlayers()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
  };

  const content = (
    <>
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? <ChevronLeft/> : <ChevronRight/>}
        </IconButton>
        <Typography variant="h6">{t("player.filter")}</Typography>
      </div>
      <TextField
        className={globalClasses.mb2}
        error={!!errors.search}
        helperText={errors.search && t(errors.search.message)}
        variant="outlined"
        fullWidth
        id="search"
        label={t("agent.search")}
        name="search"
        inputRef={register}
      />

      <CustomSearchSelect
        marginBottom
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
      />

      <RangeSlider
        containerClassName={globalClasses.mb2}
        name="height"
        label="user.height"
        control={control}
        defaultValue={[FILTER_MIN_HEIGHT, FILTER_MAX_HEIGHT]}
        max={FILTER_MAX_HEIGHT}
        min={FILTER_MIN_HEIGHT}
      />

      <RangeSlider
        containerClassName={globalClasses.mb2}
        name="birthday"
        label="user.birthday"
        control={control}
        defaultValue={[FILTER_MIN_BIRTHDAY, FILTER_MAX_BIRTHDAY]}
        max={FILTER_MAX_BIRTHDAY}
        min={FILTER_MIN_BIRTHDAY}
      />

      <CustomSelect
        errors={errors}
        containerClassName={globalClasses.mb2}
        control={control}
        options={selectorsSport.getSports().map(sport => {
          return {
            value: sport.id,
            label: sport.name,
          };
        })}
        label="user.sport"
        name="sport"
      />

      <CustomSelect
        errors={errors}
        containerClassName={globalClasses.mb2}
        control={control}
        disabled={!sport}
        options={sport ? selectorsPositions.getPositionsBySport(sport).map(position => {
          return {
            value: position.id,
            label: position.value,
          };
        }) : []}
        label="user.position"
        name="position"
      />

      <Button
        size="small"
        fullWidth
        variant="text"
        color="primary"
        onClick={clearFilter}
      >
        {t("filter.clear")}
      </Button>
    </>
  );

  return (
    <>
      <Hidden only={["md", "lg", "xl"]}>
        <Drawer
          className={classes.mobileDrawer}
          anchor="right"
          open={open}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden only={["sm", "xs"]}>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>

  );
};

export default Filters;
