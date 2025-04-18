import { useAuth } from "../../contexts/auth/Auth.hook";
import { PostType } from "../../types/post";
import React from "react";
import { getUserPosts } from "../../services/api-requests/getUserPosts";
import { toast } from "react-toastify";
import UserProfileLayout from "../../components/UserProfileLayout";
import { usePostsUpdates } from "../../contexts/postsUpdates/postsUpdates.hook";

function Profile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = React.useState<PostType[]>([]);
  const { shouldUpdatePosts, setShouldUpdatePosts } = usePostsUpdates();

  const fetchUserPosts = React.useCallback(async () => {
    if (user) {
      const data = await getUserPosts(user.uid);

      if ("error" in data) {
        toast.error(data.error);
      } else {
        setUserPosts(data.posts);
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
  }, [shouldUpdatePosts]);

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
