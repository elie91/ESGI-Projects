import { makeStyles } from "@material-ui/core/styles";
import { generateSpacing } from "../helpers/Utils";

export const drawerWidth = 350;

export const iconSize = 150;

export const useGlobalStyles = makeStyles((theme) => ({
  ...generateSpacing(theme),
}));

export const customStylesSelect = {
  valueContainer: (provided) => ({
    ...provided,
    padding: "13px 8px",
    fontFamily: "Roboto",
  }),
  option: (provided) => ({
    ...provided,
    fontFamily: "Roboto",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontFamily: "Roboto",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
  }),
};



