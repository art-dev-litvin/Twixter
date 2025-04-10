const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiPaths = {
  auth: {
    signUp: BASE_URL + "/auth/signup", // POST
    updateProfile: BASE_URL + "/auth/update-profile", // POST
  },
};
