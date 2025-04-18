import axios from "axios";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { apiPaths } from "../../constants/api-paths";

export const getUserById = async (userId: string) => {
  try {
    const { data } = await axios.get(apiPaths.auth.getUserById(userId));

    return data;
  } catch (error) {
    return getErrorMessage(error);
  }
};
