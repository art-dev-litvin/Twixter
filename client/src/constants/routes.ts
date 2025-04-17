export const routes = {
  home: "/",
  signUp: "/signup",
  signIn: "/signin",
  emailVerification: "/email-verification",
  profile: "/profile",
  editProfile: "/profile/edit",
  forgotPassword: "/forgot-password",
  editPost: (postId: string) => `/posts/${postId}/edit`,
  userById: (userId: string) => `/users/${userId}`,
};
