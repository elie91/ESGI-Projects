import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../Home";
import {
  RT_LOGIN, RT_PROFILE,
  RT_RESET_PASSWORD,
  RT_RESET_PASSWORD_TOKEN,
  RT_ROOT,
  RT_SIGNUP,
  RT_SUBSCRIPTIONS,
  RT_PLAYER_SHOW,
  RT_PLAYER_VIDEOS,
  RT_PLAYER_ADD_VIDEO,
  RT_PLAYER_EDIT_VIDEO,
  RT_PLAY_VIDEO,
  RT_SIGNUP_NEXT_STEP,
  RT_CONVERSATIONS, RT_AGENT,
  RT_AGENT_SHOW, RT_PLAYER_SHOW_VIDEOS,
} from "../../config/routes";
import {
  Home as HomeIcon,
  Subscriptions as SubscriptionsIcon,
  Shop as ShopIcon,
  Forum,
  ArrowBack,
} from "@material-ui/icons";
import i18n from "i18next";
import Subscriptions from "../Home/Subscriptions";
import SignUp from "./Security/SignUp";
import SignIn from "./Security/SignIn";
import ResetPassword from "./Security/ResetPassword";
import ResetPasswordToken from "./Security/ResetPasswordToken";
import PrivateRoute from "../PrivateRoute";
import Profile from "./Security/Profile";
import PlayerProfile from "../Player/index";
import ListVideo from "../Player/Video/ListVideo";
import AddVideo from "../Player/Video/AddVideo";
import EditVideo from "../Player/Video/EditVideo";
import VideoDialog from "../Home/Video/Dialog";
import { ROLE_AGENT, ROLE_PLAYER } from "../../config/constant";
import NextStep from "./Security/SignUp/NextStep";
import Conversations from "../Message/Conversations";
import AgentProfile from "../Agent/AgentProfile";
import AllVideos from "../Player/Video/All";

let items = [
  {
    href: RT_ROOT,
    icon: HomeIcon,
    title: i18n.t("navigation.home"),
  },
  {
    href: RT_SUBSCRIPTIONS,
    icon: SubscriptionsIcon,
    title: i18n.t("navigation.subscriptions"),
  },
  {
    roles: [ROLE_PLAYER],
    href: RT_PLAYER_VIDEOS,
    icon: ShopIcon,
    title: i18n.t("navigation.videos"),
  },
  {
    roles: [ROLE_PLAYER, ROLE_AGENT],
    href: RT_CONVERSATIONS,
    icon: Forum,
    title: i18n.t("navigation.conversations"),
  },
  {
    roles: [ROLE_AGENT],
    href: RT_AGENT,
    icon: ArrowBack,
    title: i18n.t("navigation.backToAgent"),
  },
];

const UserRouter = () => {

  return (
    <Switch>
      <Route path={RT_SIGNUP} exact component={SignUp}/>
      <Route path={RT_LOGIN} exact component={SignIn}/>
      <Route path={RT_RESET_PASSWORD} exact component={ResetPassword}/>
      <Route path={RT_RESET_PASSWORD_TOKEN} exact component={ResetPasswordToken}/>
      <PrivateRoute path={RT_PROFILE} exact component={Profile}/>
      <Route path={RT_SIGNUP_NEXT_STEP} exact component={NextStep}/>
      <Route path={RT_PLAY_VIDEO} exact component={VideoDialog}/>
      <Layout
        sidebarItems={items}
        displayBreadcrumbs={false}>
        <Route path={RT_ROOT} exact component={Home}/>
        <Route path={RT_SUBSCRIPTIONS} exact component={Subscriptions}/>
        <Route path={RT_PLAYER_SHOW} exact component={PlayerProfile}/>
        <Route path={RT_AGENT_SHOW} exact component={AgentProfile}/>
        <PrivateRoute path={RT_PLAYER_SHOW_VIDEOS} exact component={AllVideos}/>
        <PrivateRoute path={RT_PLAYER_VIDEOS} player exact component={ListVideo}/>
        <PrivateRoute path={RT_PLAYER_ADD_VIDEO} player exact component={AddVideo}/>
        <PrivateRoute path={RT_PLAYER_EDIT_VIDEO} player exact component={EditVideo}/>
        <PrivateRoute path={RT_CONVERSATIONS} player exact component={Conversations}/>
      </Layout>
    </Switch>
  );
};

export default UserRouter;
