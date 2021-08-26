import RenterLayout from "@/layout/Security/RenterLayout";
import ServiceList from "@/components/Admin/Service/ServiceList";
import ServiceNew from "@/components/Admin/Service/ServiceNew";
import ServiceEdit from "@/components/Admin/Service/ServiceEdit";

const serviceRoutes = [
  {
    path: 'services',
    component: RenterLayout,
    children: [
      {
        path: '',
        component: ServiceList,
        name: "back_service"
      },
      {
        path: 'new',
        component: ServiceNew,
        name: "back_service_new"
      },
      {
        path: ':id/edit',
        component: ServiceEdit,
        name: "back_service_edit"
      }
    ]
  },

];

export default serviceRoutes;
