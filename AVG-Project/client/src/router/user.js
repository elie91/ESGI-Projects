import UsersList from "@/components/Admin/User/UserList";
import UsersNew from "@/components/Admin/User/UserNew";
import UsersEdit from "@/components/Admin/User/UserEdit";
import AdminLayout from "@/layout/Security/AdminLayout";

const userRoutes = [
  {
    path: 'users',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: UsersList,
        name: "back_user"
      },
      {
        path: 'new',
        component: UsersNew,
        name: "back_user_new"
      },
      {
        path: ':id/edit',
        component: UsersEdit,
        name: "back_user_edit"
      }
    ]
  },

];

export default userRoutes;
