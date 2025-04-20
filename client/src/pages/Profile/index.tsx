import { useAuth } from "../../contexts/auth/Auth.hook";
import { TPost } from "../../types/post";
import React from "react";
import { getPostsByUser } from "../../services/api-requests/posts/getPostsByUser";
import UserProfileLayout from "../../components/UserProfileLayout";
import { usePostsUpdates } from "../../contexts/postsUpdates/postsUpdates.hook";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

function Profile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = React.useState<TPost[]>([]);
  const { shouldUpdatePosts, setShouldUpdatePosts } = usePostsUpdates();

  const fetchUserPosts = React.useCallback(async () => {
    if (user) {
      const res = await getPostsByUser(user.uid);

      const posts = handleResultWithToast(res);
      if (posts) {
        setUserPosts(posts);
      }
    }
  }, [user]);

  React.useEffect(() => {
    fetchUserPosts();
  }, [user, fetchUserPosts]);

  React.useEffect(() => {
    if (shouldUpdatePosts) {
      fetchUserPosts();
      setShouldUpdatePosts(false);
    }
  }, [shouldUpdatePosts, fetchUserPosts, setShouldUpdatePosts]);

  if (!user) {
    return (
      <div>
        <h1>Error, you need to login first!</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-6">Your profile</h1>
      <UserProfileLayout posts={userPosts} user={user} />
    </div>
  );
}

export default Profile;
