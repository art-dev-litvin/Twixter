import axios, { AxiosResponse } from "axios";
import { apiPaths } from "../../constants/api-paths";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { UpdatePostDto, PostType } from "../../types/post";
import { auth } from "../firebase";

const updatePost = async (
  postId: string,
  values: UpdatePostDto
): Promise<PostType | { error: string }> => {
  const user = auth?.currentUser;
  if (user) {
    try {
      const { data: newPost } = await axios.patch<
        PostType,
        AxiosResponse<PostType>,
        UpdatePostDto
      >(apiPaths.posts.updateOne(postId), values);

      return newPost;
    } catch (error) {
      return getErrorMessage(error);
    }
  } else {
    return { error: "You are no authenticated" };
  }
};

export { updatePost };
