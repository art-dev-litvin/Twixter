import axios, { AxiosResponse } from "axios";
import { apiPaths } from "../../constants/api-paths";
import { NewPostSchema } from "../../components/NewPost/schema";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { CreatePostDto, PostType } from "../../types/post";
import { auth } from "../firebase";

const createPost = async (
  values: NewPostSchema
): Promise<PostType | { error: string }> => {
  const user = auth?.currentUser;
  if (user) {
    try {
      const { title, content, imageBase64 } = values;
      const { displayName, photoURL, uid } = user;

      const { data: newPost } = await axios.post<
        PostType,
        AxiosResponse<PostType>,
        CreatePostDto
      >(apiPaths.posts.new, {
        title,
        content,
        imageBase64,
        userId: uid,
        userDisplayName: displayName || "Username",
        userPhotoUrl: photoURL || undefined,
      });

      return newPost;
    } catch (error) {
      return getErrorMessage(error);
    }
  } else {
    return { error: "You are no authenticated" };
  }
};

export { createPost };
