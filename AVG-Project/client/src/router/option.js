import RenterLayout from "@/layout/Security/RenterLayout";
import OptionList from "@/components/Admin/Option/OptionList";
import OptionNew from "@/components/Admin/Option/OptionNew";
import OptionEdit from "@/components/Admin/Option/OptionEdit";

const servicesRoutes = [
  {
    path: 'options',
    component: RenterLayout,
    children: [
      {
        path: '',
        component: OptionList,
        name: "back_option"
      },
      {
        path: 'new',
        component: OptionNew,
        name: "back_option_new"
      },
      {
        path: ':id/edit',
        component: OptionEdit,
        name: "back_option_edit"
      }
    ]
  },

];

export default servicesRoutes;
