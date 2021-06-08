import {HOME_QUERY, HOMES_QUERY} from "@/apollo/Query/home";
import {CREATE_HOME, UPDATE_HOME, DELETE_HOME} from "@/apollo/Mutation/home";
import {DELETE_PICTURE} from "@/apollo/Mutation/picture";
import {HOME_STATUS} from "../../../config/constant";

export const getHomes = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: HOMES_QUERY,
      variables: {
        orderBy: 'createdAt_ASC',
        first: values.first,
        skip: values.skip,
        where: values.where ? values.where : null
      }
    }).then((result) => {
      resolve(result.data.homes);
    })
      .catch((error) => reject(error));
  });
};

export const getHome = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: HOME_QUERY,
      variables: {
        homeId: values
      }
    }).then((result) => {
      resolve(result.data.home);
    })
      .catch((error) => reject(error));
  });
};

export const createHome = async (values, apollo) => {
    const options = values.options.map(option => {
      return {
        id: option,
      }
    });
    return new Promise((resolve, reject) => {
      apollo.mutate({
        mutation: CREATE_HOME,
        variables: {
          data: {
            name: values.name,
            description: values.description,
            address: values.address,
            city: values.city,
            country: values.country,
            price: +values.price,
            active: true,
            type: values.type,
            homeOption: {connect: options},
            pictures: {create: values.pictures},
            status: HOME_STATUS.CREATED
          }
        }
      }).then((result) => {
        resolve(result.data.home);
      })
        .catch((error) => reject(error));
    });
  };

export const editHome = async (values, apollo) => {
  const options = values.options.map(option => {
    return {
      id: option,
    }
  });
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: UPDATE_HOME,
      variables: {
        data: {
          name: values.name,
          description: values.description,
          address: values.address,
          city: values.city,
          country: values.country,
          price: +values.price,
          active: values.active,
          homeOption: {connect: options},
        },
        homeId: values.id
      }
    }).then((result) => {
      resolve(result.data.home);
    })
      .catch((error) => reject(error));
  });
};

export const deleteHome = async (values, apollo) => {
  const currentHome = await apollo.query({
    query: HOME_QUERY,
    variables: {
      homeId: values
    }
  });
  const homePictures = currentHome.data.home.pictures;
  const deletePicturesPromises = [];
  homePictures.forEach(picture => {
    deletePicturesPromises.push(
      apollo.mutate({
        mutation: DELETE_PICTURE,
        variables: {
          pictureId: picture.id
        }
      })
    )
  });
  await Promise.all(deletePicturesPromises)
  return new Promise((resolve, reject) => {
      apollo.mutate({
        mutation: DELETE_HOME,
        variables: {
          homeId: values
        }
      }).then((result) => {
        resolve(result.data.home);
      })
        .catch((error) => reject(error));
    });
};

export const updateHomeStatus = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: UPDATE_HOME,
      variables: {
        data: {
          status: values.status,
        },
        homeId: values.id
      }
    }).then((result) => {
      resolve(result.data.home);
    })
      .catch((error) => reject(error));
  });
};

