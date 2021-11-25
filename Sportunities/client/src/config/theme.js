import { makeStyles } from "@material-ui/core/styles";

export const drawerWidth = 250;

export const iconSize = 150;

export const useGlobalStyles = makeStyles((theme) => ({
    relative: {
      position: "relative",
    },
    topRight: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    textRight: {
      textAlign: "right",
    },
    textCenter: {
      textAlign: "center",
    },
    dFlex: {
      display: "flex",
    },
    h100: {
      height: "100%",
    },
    textWhite: {
      color: "#fff",
    },
    justifyBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    justifyAround: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },
    justifyCenter: {
      justifyContent: "center",
    },
    alignItemsCenter: {
      display: "flex",
      alignItems: "center",
    },
    flexColumn: {
      display: "flex",
      flexDirection: "column",
    },
    flexColumnCenter: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    flexRowCenter: {
      display: "flex",
      alignItems: "center",
    },
    cardCenter: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    cursorPointer: {
      cursor: "pointer",
    },
    body: {
      paddingTop: theme.spacing(10),
    },
    cardSelected: {
      border: "2px solid " + theme.palette.primary.main,
    },
    dNone: {
      display: "none",
    },
    w100: {
      width: "100%",
    },
    avatarLarge: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    fontWeightBold: {
      fontWeight: "bold",
    },
    fontWeight600: {
      fontWeight: "600",
    },
    borderBottom: {
      borderBottom: "1px solid rgba(18, 18, 18, 0.12)",
    },
    iconButton: {
      backgroundColor: "rgba(255,255,255, 0.1)",
    },
    activeIconButton: {
      backgroundColor: "rgba(244, 67, 53, 0.1)!important",
      color: theme.palette.error.main + "!important",
    },
    table: {
      minWidth: 650,
    },
    mt0: { marginTop: 0 },
    mt1: { marginTop: 8 },
    mt2: { marginTop: 16 },
    mt3: { marginTop: 24 },
    mt4: { marginTop: 32 },
    mt5: { marginTop: 40 },
    mt6: { marginTop: 48 },
    mt7: { marginTop: 56 },
    mt8: { marginTop: 64 },
    mt9: { marginTop: 72 },
    mt10: { marginTop: 80 },
    ml0: { marginLeft: 0 },
    ml1: { marginLeft: 8 },
    ml2: { marginLeft: 16 },
    ml3: { marginLeft: 24 },
    ml4: { marginLeft: 32 },
    ml5: { marginLeft: 40 },
    ml6: { marginLeft: 48 },
    ml7: { marginLeft: 56 },
    ml8: { marginLeft: 64 },
    ml9: { marginLeft: 72 },
    ml10: { marginLeft: 80 },
    mr0: { marginRight: 0 },
    mr1: { marginRight: 8 },
    mr2: { marginRight: 16 },
    mr3: { marginRight: 24 },
    mr4: { marginRight: 32 },
    mr5: { marginRight: 40 },
    mr6: { marginRight: 48 },
    mr7: { marginRight: 56 },
    mr8: { marginRight: 64 },
    mr9: { marginRight: 72 },
    mr10: { marginRight: 80 },
    mb0: { marginBottom: 0 },
    mb1: { marginBottom: 8 },
    mb2: { marginBottom: 16 },
    mb3: { marginBottom: 24 },
    mb4: { marginBottom: 32 },
    mb5: { marginBottom: 40 },
    mb6: { marginBottom: 48 },
    mb7: { marginBottom: 56 },
    mb8: { marginBottom: 64 },
    mb9: { marginBottom: 72 },
    mb10: { marginBottom: 80 },
    my0: { marginTop: 0, marginBottom: 0 },
    my1: { marginTop: 8, marginBottom: 8 },
    my2: { marginTop: 16, marginBottom: 16 },
    my3: { marginTop: 24, marginBottom: 24 },
    my4: { marginTop: 32, marginBottom: 32 },
    my5: { marginTop: 40, marginBottom: 40 },
    my6: { marginTop: 48, marginBottom: 48 },
    my7: { marginTop: 56, marginBottom: 56 },
    my8: { marginTop: 64, marginBottom: 64 },
    my9: { marginTop: 72, marginBottom: 72 },
    my10: { marginTop: 80, marginBottom: 80 },
    mx0: { marginLeft: 0, marginRight: 0 },
    mx1: { marginLeft: 8, marginRight: 8 },
    mx2: { marginLeft: 16, marginRight: 16 },
    mx3: { marginLeft: 24, marginRight: 24 },
    mx4: { marginLeft: 32, marginRight: 32 },
    mx5: { marginLeft: 40, marginRight: 40 },
    mx6: { marginLeft: 48, marginRight: 48 },
    mx7: { marginLeft: 56, marginRight: 56 },
    mx8: { marginLeft: 64, marginRight: 64 },
    mx9: { marginLeft: 72, marginRight: 72 },
    mx10: { marginLeft: 80, marginRight: 80 },
    pt0: { paddingTop: 0 },
    pt1: { paddingTop: 8 },
    pt2: { paddingTop: 16 },
    pt3: { paddingTop: 24 },
    pt4: { paddingTop: 32 },
    pt5: { paddingTop: 40 },
    pt6: { paddingTop: 48 },
    pt7: { paddingTop: 56 },
    pt8: { paddingTop: 64 },
    pt9: { paddingTop: 72 },
    pt10: { paddingTop: 80 },
    pl0: { paddingLeft: 0 },
    pl1: { paddingLeft: 8 },
    pl2: { paddingLeft: 16 },
    pl3: { paddingLeft: 24 },
    pl4: { paddingLeft: 32 },
    pl5: { paddingLeft: 40 },
    pl6: { paddingLeft: 48 },
    pl7: { paddingLeft: 56 },
    pl8: { paddingLeft: 64 },
    pl9: { paddingLeft: 72 },
    pl10: { paddingLeft: 80 },
    pr0: { paddingRight: 0 },
    pr1: { paddingRight: 8 },
    pr2: { paddingRight: 16 },
    pr3: { paddingRight: 24 },
    pr4: { paddingRight: 32 },
    pr5: { paddingRight: 40 },
    pr6: { paddingRight: 48 },
    pr7: { paddingRight: 56 },
    pr8: { paddingRight: 64 },
    pr9: { paddingRight: 72 },
    pr10: { paddingRight: 80 },
    pb0: { paddingBottom: 0 },
    pb1: { paddingBottom: 8 },
    pb2: { paddingBottom: 16 },
    pb3: { paddingBottom: 24 },
    pb4: { paddingBottom: 32 },
    pb5: { paddingBottom: 40 },
    pb6: { paddingBottom: 48 },
    pb7: { paddingBottom: 56 },
    pb8: { paddingBottom: 64 },
    pb9: { paddingBottom: 72 },
    pb10: { paddingBottom: 80 },
    py0: { paddingTop: 0, paddingBottom: 0 },
    py1: { paddingTop: 8, paddingBottom: 8 },
    py2: { paddingTop: 16, paddingBottom: 16 },
    py3: { paddingTop: 24, paddingBottom: 24 },
    py4: { paddingTop: 32, paddingBottom: 32 },
    py5: { paddingTop: 40, paddingBottom: 40 },
    py6: { paddingTop: 48, paddingBottom: 48 },
    py7: { paddingTop: 56, paddingBottom: 56 },
    py8: { paddingTop: 64, paddingBottom: 64 },
    py9: { paddingTop: 72, paddingBottom: 72 },
    py10: { paddingTop: 80, paddingBottom: 80 },
    px0: { paddingLeft: 0, paddingRight: 0 },
    px1: { paddingLeft: 8, paddingRight: 8 },
    px2: { paddingLeft: 16, paddingRight: 16 },
    px3: { paddingLeft: 24, paddingRight: 24 },
    px4: { paddingLeft: 32, paddingRight: 32 },
    px5: { paddingLeft: 40, paddingRight: 40 },
    px6: { paddingLeft: 48, paddingRight: 48 },
    px7: { paddingLeft: 56, paddingRight: 56 },
    px8: { paddingLeft: 64, paddingRight: 64 },
    px9: { paddingLeft: 72, paddingRight: 72 },
    px10: { paddingLeft: 80, paddingRight: 80 },
    p0: { padding: 0 },
    p1: { padding: 8 },
    p2: { padding: 16 },
    p3: { padding: 24 },
    p4: { padding: 32 },
    p5: { padding: 40 },
    p6: { padding: 48 },
    p7: { padding: 56 },
    p8: { padding: 64 },
    p9: { padding: 72 },
    p10: { padding: 80 },
    m0: { margin: 0 },
    m1: { margin: 8 },
    m2: { margin: 16 },
    m3: { margin: 24 },
    m4: { margin: 32 },
    m5: { margin: 40 },
    m6: { margin: 48 },
    m7: { margin: 56 },
    m8: { margin: 64 },
    m9: { margin: 72 },
    m10: { margin: 80 },
  }
), { index: 1 });

export const useStylesCrop = makeStyles((theme) => ({
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    marginBottom: theme.spacing(2),
    background: "#333",
    [theme.breakpoints.up("sm")]: {
      height: 400,
    },
  },
}));

export const customStylesSelect = {
  valueContainer: (provided) => ({
    ...provided,
    fontSize: ".85rem",
    padding: "13px 8px",
    fontFamily: "Roboto",
  }),
  option: (provided) => ({
    ...provided,
    fontFamily: "Roboto",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: ".85rem",
    fontFamily: "Roboto",
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: ".85rem",
    fontFamily: "Roboto",
    zIndex: 10,
  }),
};


