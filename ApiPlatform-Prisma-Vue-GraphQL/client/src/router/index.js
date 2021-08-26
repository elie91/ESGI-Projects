import Vue from "vue";
import Router from "vue-router";
import NotFound from "../components/NotFound";
import Homepage from "../components/Front/Homepage/Homepage";
import Profile from "../components/Security/Profile";
import BackLayout from "@/layout/BackLayout";
import Admin from "@/components/Admin/Admin";
import FrontLayout from "@/layout/FrontLayout";
import SignUp from "@/components/Security/SignUp";
import SignIn from "@/components/Security/SignIn";
import userRoutes from "./user";
import homeRoutes from "./home";
import eventRoutes from "./event";
import serviceRoutes from "@/router/service";
import optionRoutes from "@/router/option";
import HomeList from "@/components/Front/Home/HomeList";
import rentRoutes from "@/router/rent";
import {
  RT_FRONT_EVENTS,
  RT_FRONT_EVENTS_SHOW,
  RT_FRONT_HOMES,
  RT_FRONT_HOMES_LOCATION,
  RT_ROOT,
} from "@/router/routes";
import HomeForm from "@/components/Front/Home/HomeForm";
import EventList from "@/components/Front/Event/EventList";
import EventShow from "@/components/Front/Event/EventShow";


Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: RT_ROOT,
      component: FrontLayout,
      children: [
        {
          path: RT_ROOT,
          component: Homepage,
          name: "front_index"
        },
        {
          path: RT_FRONT_HOMES,
          component: HomeList,
          name: "front_homes"
        },
        {
          path: RT_FRONT_HOMES_LOCATION,
          component: HomeForm,
          name: "front_homes_location"
        },
        {
          path: RT_FRONT_EVENTS,
          component: EventList,
          name: "front_events"
        },
        {
          path: RT_FRONT_EVENTS_SHOW,
          component: EventShow,
          name: "front_events_show"
        },
        {
          path: 'sign-in',
          component: SignIn,
          name: "front_signin"
        },
        {
          path: 'sign-up',
          component: SignUp,
          name: "front_signup"
        },
        {
          path: 'profile',
          component: Profile,
          name: "front_profile"
        }
      ]
    },
    {
      path: '/admin',
      component: BackLayout,
      children: [
        {
          path: '',
          component: Admin,
          name: "back_dashboard"
        },
        ...userRoutes,
        ...homeRoutes,
        ...eventRoutes,
        ...serviceRoutes,
        ...optionRoutes,
        ...rentRoutes
      ]
    },
    {
      name: "not-found",
      path: "*",
      component: NotFound
    }
  ],
});


export default router;
