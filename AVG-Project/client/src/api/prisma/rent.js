import {RENTS_QUERY} from "@/apollo/Query/rent";
import {CREATE_RENT} from "@/apollo/Mutation/rent";

export const getRents = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: RENTS_QUERY,
      variables: {
        orderBy: 'createdAt_DESC',
        first: values.first,
        skip: values.skip,
        where: values.where ? values.where : null
      }
    }).then((result) => {
      resolve(result.data.rents);
    })
      .catch((error) => reject(error));
  });
};


export const createRent = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: CREATE_RENT,
      variables: {
        data: {
          startDate: values.startDate,
          endDate: values.endDate,
          totalPrice: values.totalPrice,
          home: {connect: {id: values.home}},
          rentService: {
            connect: values.services.map(service => {
              return {
                id: service
              }
            })
          },
          owner: {connect: {id: values.owner}}
        }
      }
    }).then((result) => {
      resolve(result.data.createRent);
    })
      .catch((error) => reject(error));
  });
};
