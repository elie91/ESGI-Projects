import { API_RENTS, API_PLATFORM_ENDPOINT } from "../../../config/entrypoint";
import { request } from "@/utils";

export const getRents = async (params = []) => {
  return await request(
    params.next ? `${API_PLATFORM_ENDPOINT}${params.next}` : API_RENTS,
    {
      withMetadata: true,
      query: params,
    }
  );
};
