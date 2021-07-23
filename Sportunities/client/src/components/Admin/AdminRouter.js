import React from "react";
import { Switch } from "react-router-dom";
import Layout from "../Layout/Layout";
import {
  RT_ADMIN,
  RT_ADMIN_AGENTS, RT_ADMIN_AGENTS_EDIT,
  RT_ADMIN_CLUBS,
  RT_ADMIN_CLUBS_ADD,
  RT_ADMIN_CLUBS_EDIT,
  RT_ADMIN_POSITIONS_ADD,
  RT_ADMIN_POSITIONS_EDIT,
  RT_ADMIN_SPORTS,
  RT_ADMIN_SPORTS_ADD,
  RT_ADMIN_SPORTS_EDIT,
  RT_ADMIN_USERS,
  RT_ADMIN_USERS_ADD,
  RT_ADMIN_USERS_EDIT,
} from "../../config/routes";
import PrivateRoute from "../PrivateRoute";
import Dashboard from "./Dashboard";
import i18n from "i18next";
import { PeopleAlt, Dashboard as DashboardIcon, Sports } from "@material-ui/icons";
import ListSport from "./Sport/ListSport";
import EditSport from "./Sport/EditSport";
import AddSport from "./Sport/AddSport";
import ListUser from "./User/ListUser";
import EditUser from "./User/EditUser";
import AddUser from "./User/AddUser";
import ListClub from "./Club/ListClub";
import AddClub from "./Club/AddClub";
import EditClub from "./Club/EditClub";
import AddPosition from "./Position/AddPosition";
import EditPosition from "./Position/EditPosition";
import ListAgent from "./Agent/ListAgent";
import EditAgent from "./Agent/EditAgent";

const items = [
  {
    href: RT_ADMIN,
    icon: DashboardIcon,
    title: "Dashboard",
    hrefAdmin: RT_ADMIN,
  },
  {
    href: RT_ADMIN_USERS,
    icon: PeopleAlt,
    title: i18n.t("navigation.users"),
    child: [
      {
        href: RT_ADMIN_USERS,
        title: i18n.t("user.list"),
      },
      {
        href: RT_ADMIN_USERS_ADD,
        title: i18n.t("user.add"),
      },
      {
        href: RT_ADMIN_AGENTS,
        title: i18n.t("user.accept"),
      },
    ],
  },
  {
    href: RT_ADMIN_SPORTS,
    icon: Sports,
    title: i18n.t("navigation.sports"),
    child: [
      {
        href: RT_ADMIN_SPORTS,
        title: i18n.t("sport.list"),
      },
      {
        href: RT_ADMIN_SPORTS_ADD,
        title: i18n.t("sport.add"),
      },
    ],
  },
  {
    href: RT_ADMIN_CLUBS,
    icon: Sports,
    title: i18n.t("navigation.clubs"),
    child: [
      {
        href: RT_ADMIN_CLUBS,
        title: i18n.t("club.list"),
      },
      {
        href: RT_ADMIN_CLUBS_ADD,
        title: i18n.t("club.add"),
      },
    ],
  },
];

const AdminRouter = () => {

  return (
    <Layout sidebarItems={items}>
      <Switch>

        <PrivateRoute path={RT_ADMIN} admin exact component={Dashboard}/>

        <PrivateRoute path={RT_ADMIN_SPORTS} admin exact component={ListSport}/>
        <PrivateRoute path={RT_ADMIN_SPORTS_ADD} admin exact component={AddSport}/>
        <PrivateRoute path={RT_ADMIN_SPORTS_EDIT} admin exact component={EditSport}/>

        <PrivateRoute path={RT_ADMIN_POSITIONS_ADD} admin exact component={AddPosition}/>
        <PrivateRoute path={RT_ADMIN_POSITIONS_EDIT} admin exact component={EditPosition}/>

        <PrivateRoute path={RT_ADMIN_USERS} admin exact component={ListUser}/>
        <PrivateRoute path={RT_ADMIN_USERS_ADD} admin exact component={AddUser}/>
        <PrivateRoute path={RT_ADMIN_USERS_EDIT} admin exact component={EditUser}/>
        <PrivateRoute path={RT_ADMIN_AGENTS} admin exact component={ListAgent}/>
        <PrivateRoute path={RT_ADMIN_AGENTS_EDIT} admin exact component={EditAgent}/>

        <PrivateRoute path={RT_ADMIN_CLUBS} admin exact component={ListClub}/>
        <PrivateRoute path={RT_ADMIN_CLUBS_ADD} admin exact component={AddClub}/>
        <PrivateRoute path={RT_ADMIN_CLUBS_EDIT} admin exact component={EditClub}/>

      </Switch>
    </Layout>
  );
};

export default AdminRouter;
