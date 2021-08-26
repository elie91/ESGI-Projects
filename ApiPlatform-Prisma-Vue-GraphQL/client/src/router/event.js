import EventsList from "@/components/Admin/Event/EventList";
import EventsEdit from "@/components/Admin/Event/EventEdit";
import RenterLayout from "@/layout/Security/RenterLayout";

const eventRoutes = [
  {
    path: "event",
    component: RenterLayout,
    children: [
      {
        path: "",
        component: EventsList,
        name: "back_event",
      },
      {
        path: ":id/edit",
        component: EventsEdit,
        name: "back_event_edit",
      },
    ],
  },

];

export default eventRoutes;
