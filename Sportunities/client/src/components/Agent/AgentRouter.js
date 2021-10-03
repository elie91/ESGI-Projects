import React from "react";
import { Switch } from "react-router-dom";
import Layout from "../Layout/Layout";
import Dashboard from "./Dashboard";
import {
  RT_AGENT,
  RT_AGENT_CONVERSATIONS,
  RT_AGENT_PLAYERS,
} from "../../config/routes";
import PrivateRoute from "../PrivateRoute";
import Players from "./Players";
import { Dashboard as DashboardIcon, Forum, People } from "@material-ui/icons";
import i18n from "i18next";
import { ROLE_AGENT } from "../../config/constant";
import Conversations from "../Message/Conversations";
import { useAuth } from "../../context/AuthContext";

const items = [
  {
    href: RT_AGENT,
    icon: DashboardIcon,
    title: "Dashboard",
  },
];

const itemsConfirmed = [
  {
    href: RT_AGENT_PLAYERS,
    icon: People,
    title: i18n.t("agent.listPlayer"),
  },
  {
    role: ROLE_AGENT,
    href: RT_AGENT_CONVERSATIONS,
    icon: Forum,
    title: i18n.t("navigation.conversations"),
  },
];

const AgentRouter = () => {

  const { user } = useAuth();

  const getItems = () => {
    let array = items;
    if (user && user.agent.isConfirmed) {
      array = [...array, ...itemsConfirmed];
    }
    return array;
  };

  return (
    <Layout
      sidebarItems={getItems()}
      displayBreadcrumbs={false}
    >
        <Switch>
          <PrivateRoute path={RT_AGENT} agent exact component={Dashboard}/>
          <PrivateRoute path={RT_AGENT_PLAYERS} agent exact component={Players}/>
          <PrivateRoute path={RT_AGENT_CONVERSATIONS} agent exact component={Conversations}/>
        </Switch>
    </Layout>
  );
};

export default AgentRouter;
