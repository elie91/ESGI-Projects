import {CHECK_LOGIN} from '@/apollo/Mutation/security';


export const signIn = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: CHECK_LOGIN,
      variables: {
        email: values.email,
        password: values.password,
      },
    }).then((result) => {
      resolve(result.data.check_login);
    })
    .catch((error) => reject(error));
  });
};
