const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiPaths = {
  auth: {
    signUp: BASE_URL + "/auth/signup", // POST
    updateProfile: BASE_URL + "/auth/update-profile", // POST
    getUserById: (userId: string) => BASE_URL + `/auth/user/${userId}`, // GET
  },
  posts: {
    new: BASE_URL + "/posts/new", // POST
    getAll: BASE_URL + "/posts", // GET
    updateOne: (postId: string) => BASE_URL + `/posts/${postId}`, // PATCH
    getOne: (postId: string) => BASE_URL + `/posts/${postId}`, // GET
    getAllByUser: (userId: string) => BASE_URL + `/posts/user/${userId}`, // GET
    deleteOne: (postId: string) => BASE_URL + `/posts/${postId}`, // DELETE
  },
};
