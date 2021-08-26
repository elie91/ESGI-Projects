import { API_HOMES, API_PLATFORM_ENDPOINT } from "../../../config/entrypoint";
import { request } from "@/utils";

export const getHomes = async (params = []) => {
  return await request(
    params.next ? `${API_PLATFORM_ENDPOINT}${params.next}` : API_HOMES,
    {
      withMetadata: true,
      query: params,
    }
  );
};

export const getHome = async (id) => {
  return await request(`${API_HOMES}`, { id });
};

export const createHome = async (values) => {
  return await request(API_HOMES, {
    method: "POST",
    body: {
      name: values.name,
      description: values.description,
      address: values.address,
      city: values.city,
      country: values.country,
      price: +values.price,
      active: values.active,
      type: values.type,
      options: values.options,
      pictures: values.pictures,
    },
  });
};

export const editHome = async (values) => {
  return await request(API_HOMES, {
    method: "PUT",
    id: values.id,
    body: {
      ...values,
      options: values.options,
    },
  });
};

export const updateHomeStatus = async (values) => {
  return await request(`${API_HOMES}/${values.id}/status`, {
    method: "POST",
    body: {
      status: values.status
    }
  })
}

export const deleteHome = async (id) => {
  return await request(`${API_HOMES}/${id}`, {
    method: "DELETE",
  });
};
