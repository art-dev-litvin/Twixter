const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiPaths = {
  auth: {
    signUp: BASE_URL + "/auth/signup", // POST
    signIn: BASE_URL + "/auth/signin", // POST
  },
};
