import { apiRequest } from "../../../utils/apiRequest";
import { apiPaths } from "../../../constants/api-paths";
import { PostFormFields } from "../../../components/PostForm/schema";
import { CreatePostDto, TPost } from "../../../types/post";
import { auth } from "../../firebase";
import { ApiResponse } from "../../../types/api";

export const createPost = (values: PostFormFields): ApiResponse<TPost> => {
  const user = auth?.currentUser;
  if (!user) return Promise.resolve({ error: "You are not authenticated" });

  const { title, content, imageUrl, imageId } = values;
  const { displayName, photoURL, uid } = user;

  return apiRequest<TPost>({
    method: "POST",
    url: apiPaths.posts.new,
    data: {
      title,
      content,
      imageUrl,
      imageId,
      userId: uid,
      userDisplayName: displayName || "Username",
      userPhotoUrl: photoURL || undefined,
    } as CreatePostDto,
  });
};
