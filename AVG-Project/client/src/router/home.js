import HomeList from "@/components/Admin/Home/HomeList";
import HomeEdit from "@/components/Admin/Home/HomeEdit";
import HomeNew from "@/components/Admin/Home/HomeNew";
import RenterLayout from "@/layout/Security/RenterLayout";

const homeRoutes = [
  {
    path: 'homes',
    component: RenterLayout,
    children: [
      {
        path: '',
        component: HomeList,
        name: "back_home"
      },
      {
        path: 'new',
        component: HomeNew,
        name: "back_home_new"
      },
      {
        path: ':id/edit',
        component: HomeEdit,
        name: "back_home_edit"
      }
    ]
  },
]

export default homeRoutes;
