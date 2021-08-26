import RentList from "@/components/Admin/Rent/RentList";
import RenterLayout from "@/layout/Security/RenterLayout";

const rentRoutes = [
  {
    path: 'rent',
    component: RenterLayout,
    children: [
      {
        path: '',
        component: RentList,
        name: "back_rent"
      },
    ]
  },

];

export default rentRoutes;
